import { HttpException, Injectable } from '@nestjs/common';
import { WebexConfig } from '../shared/webex.config';
import axios from 'axios';

@Injectable()
export class WebexIntegrationService {
  private readonly apiUrl = WebexConfig.apiBaseUrl;

  async createMeeting(
    accessToken: string,
    title: string,
    start: string,
    end: string,
  ) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/meetings`,
        {
          title: title,
          start: start,
          end: end,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response?.data || 'Webex API Error', 500);
    }
  }

  async getMeetingDetails(accessToken: string, meetingId: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/meetings/${meetingId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response?.data || 'Webex API Error', 500);
    }
  }

  authorize() {
    return {
      url: `${WebexConfig.apiBaseUrl}/authorize?client_id=${WebexConfig.clientId}&response_type=code&redirect_uri=${WebexConfig.redirectUri}&scope=${process.env.WEBEX_SCOPES}`,
    };
  }
}
