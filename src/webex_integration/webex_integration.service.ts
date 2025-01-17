import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WebexConfig } from '../shared/webex.config';
import axios from 'axios';
import { BookingService } from '../booking/booking.service';
import { Queue } from "bullmq";

@Injectable()
export class WebexIntegrationService {
  private readonly apiUrl = WebexConfig.apiBaseUrl;

  constructor(
    private readonly bookingService: BookingService,
    @Inject('TASK_QUEUE') private readonly queue: Queue
    ) {}

  async scheduleTokenRefresh(refreshToken: string, clientId: string, clientSecret: string) {
    const delay = 24 * 60 * 60 * 1000 - 5 * 60 * 1000; // Schedule 5 minutes before expiration (24h lifespan)
    // const delay = 60 * 60 * 1000 - 55 * 60 * 1000; // Schedule 5 minutes before expiration (test lifespan)

    await this.queue.add(
      'refresh-token',
      { refreshToken, clientId, clientSecret },
      {
        repeat: { every: delay }, // Repeat the job daily
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      }
    );
  }

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
      const meetingDetails = response.data;

      await this.bookingService.update(bookingId, {
        calendlyEventId: meetingDetails.calendlyEventId,
        meetingStartTime: meetingDetails.start,
        meetingEndTime: meetingDetails.end,
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

  async getAuthorizations(accessToken: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/authorizations`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response?.data || 'Webex API Error', 500);
    }
  }

  async deleteAuthorizations(webexToken: string) {
     const authorizations = await this.getAuthorizations(webexToken);
     for (let i = 0; i < 700; i++) {
       const item = authorizations.items[i + 1];
       await axios.delete(`${this.apiUrl}/authorizations/${item.id}`, {
         headers: { Authorization: `Bearer ${webexToken}` },
       });
     }

  }
}
