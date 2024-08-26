import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OtpService {
  private readonly apiKey = process.env.AT_API_KEY;
  private readonly username = process.env.AT_USERNAME;
  private readonly apiUrl = 'https://api.sandbox.africastalking.com/version1/messaging';

  async sendSms(mobileNumber: string, message: string): Promise<any> {
    const data = new URLSearchParams({
      username: this.username,
      to: mobileNumber,
      message: message,
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'apiKey': this.apiKey,
    };

    try {
      const response = await axios.post(this.apiUrl, data.toString(), { headers });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send SMS');
    }
  }

  async sendSmsOld(mobileNumber: string, message: string): Promise<any> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          sender: 'Capital Connect Africa',
          recipient: mobileNumber,
          content: message,
        },
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
}
