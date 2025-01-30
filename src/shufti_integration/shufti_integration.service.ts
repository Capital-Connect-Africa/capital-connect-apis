import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ShuftiIntegrationService {
  private readonly BASE_URL = process.env.BASE_URL;
  private readonly CLIENT_ID = process.env.SHUFTI_CLIENT_ID;
  private readonly SECRET_KEY = process.env.SHUFTI_SECRET_KEY;

  constructor(private readonly httpService: HttpService) {}

  async initiateVerification(payload: any): Promise<any> {
    const timestamp = new Date().toISOString();
    const authHeader = Buffer.from(`${this.CLIENT_ID}:${this.SECRET_KEY}`).toString('base64');

    const headers = {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/json',
    };

    const requestBody = {
      ...payload,
      callback_url: 'https://your-callback-url.com/shufti/callback',
      redirect_url: 'https://your-app-url.com/redirect',
      timestamp,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.BASE_URL}/`, requestBody, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error('Shufti Pro API Error:', error.response?.data || error.message);
      throw error;
    }
  }
}
