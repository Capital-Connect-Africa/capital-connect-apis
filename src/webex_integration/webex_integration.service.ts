import { HttpException, Injectable } from '@nestjs/common';
import { WebexConfig } from '../shared/webex.config';
import axios from 'axios';
import { BookingService } from '../booking/booking.service';

@Injectable()
export class WebexIntegrationService {
  private readonly apiUrl = WebexConfig.apiBaseUrl;

  constructor(private readonly bookingService: BookingService) {}

  async createMeeting(
    accessToken: string,
    title: string,
    start: string,
    end: string,
    timezone: string,
    invitees: any,
    bookingId: number,
  ) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/meetings`,
        {
          title: title,
          start: start,
          end: end,
          timezone: timezone,
          invitees: invitees,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      await this.bookingService.update(bookingId, {
        calendlyEventId: response.data.id,
      });
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
      return { ...response.data, accessToken };
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
