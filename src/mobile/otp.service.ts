import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as process from 'node:process';
const SibApiV3Sdk = require('sib-api-v3-typescript');

@Injectable()
export class OtpService {
  private readonly apiKey = process.env.AT_API_KEY;
  private readonly username = process.env.AT_USERNAME;
  private readonly apiUrl = process.env.AT_API_URL;

  async sendSmsViaAfricasTalking(
    mobileNumber: string,
    message: string,
  ): Promise<any> {
    const data = new URLSearchParams({
      username: this.username,
      to: mobileNumber,
      message: message,
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      apiKey: this.apiKey,
    };

    try {
      const response = await axios.post(this.apiUrl, data.toString(), {
        headers,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log('error', error);
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

  async sendSmsViaBrevo(mobileNumber: string, message: string): Promise<any> {
    const apiInstance = new SibApiV3Sdk.TransactionalSMSApi();

    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY_SMS;

    const sendTransacSms = new SibApiV3Sdk.SendTransacSms();
    sendTransacSms.sender = 'CapitalCon';
    sendTransacSms.recipient = mobileNumber;
    sendTransacSms.content = message;
    sendTransacSms.type = 'transactional';
    sendTransacSms.webUrl = 'https://example.com/notifyUrl';

    apiInstance.sendTransacSms(sendTransacSms).then(
      function (data) {
        console.log(
          'API called successfully. Returned data: ' + JSON.stringify(data),
        );
      },
      function (error) {
        console.error(error);
      },
    );
  }
}
