import { Injectable } from '@nestjs/common';
import axios from 'axios';
const SibApiV3Sdk = require('sib-api-v3-typescript');

@Injectable()
export class OtpService {
  private readonly apiKey = process.env.BREVO_API_KEY_SMS;
  private readonly apiUrl = 'http://api.brevo.com/v3/transactionalSMS/sms';

  async sendSms(mobileNumber: string, message: string): Promise<any> {
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
