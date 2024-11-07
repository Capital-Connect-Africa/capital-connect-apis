import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { WebexConfig } from './webex.config';
import { HttpService } from '@nestjs/axios';
import redisClient from './redisClient';

@Injectable()
export class WebexTokenMiddleware implements NestMiddleware {
  constructor(private readonly httpService: HttpService) {}

  private token: string;
  private tokenExpiry: number;

  async use(req: any, res: any, next: () => void) {
    const accessTokenKey = `accessToken`;
    const refreshTokenKey = `refreshToken`;
    const accessTokenExpiryKey = `accessTokenExpiry`;

    let accessToken = await redisClient.get(accessTokenKey);
    const accessTokenExpiry = await redisClient.get(accessTokenExpiryKey);
    console.log('Webex Access Token', accessToken);
    // Check if access token is expired
    if (
      !accessToken ||
      (accessTokenExpiry && new Date() > new Date(accessTokenExpiry))
    ) {
      // If expired, get the refresh token from Redis
      const refreshToken = await redisClient.get(refreshTokenKey);
      console.log('Webex Refresh Token', refreshToken);
      if (!refreshToken) {
        // return res.status(401).json({ error: 'Authentication required' });
        const {
          access_token,
          expires_in,
          refresh_token,
          refresh_token_expires_in,
        } = await this.generateToken(req.headers.code);
        const newAccessToken = access_token;
        const newRefreshToken = refresh_token;
        const accessTokenExpiryTime = new Date(Date.now() + expires_in * 1000);

        // Store new tokens and expiry times in Redis
        await redisClient.set(accessTokenKey, newAccessToken);
        await redisClient.set(refreshTokenKey, newRefreshToken);
        await redisClient.set(
          accessTokenExpiryKey,
          accessTokenExpiryTime.toISOString(),
        );
        req.headers['webex_authorization'] = access_token;
        next();
      } else {
        // Request a new access token using the refresh token
        try {
          const response = await this.httpService
            .post('https://api.webex.com/v1/oauth/token', {
              grant_type: 'refresh_token',
              client_id: process.env.CLIENT_ID,
              client_secret: process.env.CLIENT_SECRET,
              refresh_token: refreshToken,
            })
            .toPromise();
          const newAccessToken = response.data.access_token;
          const newRefreshToken = response.data.refresh_token;
          const accessTokenExpiryTime = new Date(
            Date.now() + response.data.expires_in * 1000,
          );

          // Store new tokens and expiry times in Redis
          await redisClient.set(accessTokenKey, newAccessToken);
          await redisClient.set(refreshTokenKey, newRefreshToken);
          await redisClient.set(
            accessTokenExpiryKey,
            accessTokenExpiryTime.toISOString(),
          );

          // Use the new access token for the request
          accessToken = newAccessToken;
        } catch (error) {
          return res.status(401).json({ error: 'Failed to refresh token' });
        }
      }
    }
    req.headers['webex_authorization'] = accessToken;
    next();
  }

  private isTokenExpired(): boolean {
    if (!this.token || !this.tokenExpiry) {
      return true;
    }
    const now = Math.floor(Date.now() / 1000);
    console.log(
      'Webex Now',
      now,
      'Webex Token expiry',
      this.tokenExpiry,
      'Webex Difference',
      this.tokenExpiry - now,
    );
    return now >= this.tokenExpiry;
  }

  private async generateToken(code: string) {
    console.log('Webex Code', code);
    if (this.isTokenExpired()) {
      try {
        const response = await this.httpService
          .post('https://webexapis.com/v1/access_token', {
            grant_type: 'authorization_code',
            client_id: WebexConfig.clientId,
            client_secret: WebexConfig.clientSecret,
            code: code,
            redirect_uri: WebexConfig.redirectUri,
          })
          .toPromise();
        console.log('Webex Token Response', response.data);
        return response.data;
      } catch (error) {
        console.log('Failed to refresh token', error);
        throw new HttpException('Failed to refresh token', 500);
      }
    }
  }
}
