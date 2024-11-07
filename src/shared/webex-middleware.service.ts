import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { WebexConfig } from './webex.config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WebexTokenMiddleware implements NestMiddleware {
  constructor(private readonly httpService: HttpService) {}

  private token: string;
  private tokenExpiry: number;

  async use(req: any, res: any, next: () => void) {
    if (this.isTokenExpired()) {
      try {
        const response = await this.httpService
          .post('https://webexapis.com/v1/access_token', {
            grant_type: 'authorization_code',
            client_id: WebexConfig.clientId,
            client_secret: WebexConfig.clientSecret,
            code: 'ODc5Njc2MGYtN2I5OC00N2RhLWJhMGItMjIzMGFlZTczNWJlYWExMDA5YTktOGUz_P0A1_bdd2aed2-da17-481d-bd6f-b43037ee90b7',
            redirect_uri: WebexConfig.redirectUri,
            // refresh_token: req.refreshToken,
          })
          .toPromise();
        console.log('Webex Token Response', response.data);
        this.token = response.data.access_token;
        req.headers['webex_authorization'] = response.data.access_token;
      } catch (error) {
        console.log('Failed to refresh token', error);
        throw new HttpException('Failed to refresh token', 500);
      }
    }
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
}
