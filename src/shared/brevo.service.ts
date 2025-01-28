import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
const brevo = require('@getbrevo/brevo');

@Injectable()
export class BrevoService {
  constructor() {}

  async sendEmailViaBrevo(msg: any, recipients: any) {
    const apiInstance = new brevo.TransactionalEmailsApi();

    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = msg.subject;
    sendSmtpEmail.htmlContent = msg.html;
    sendSmtpEmail.sender = {
      name: 'Capital Connect',
      email: process.env.FROM_EMAIL,
    };
    sendSmtpEmail.to = recipients;
    sendSmtpEmail.replyTo = {
      name: 'Capital Connect',
      email: process.env.FROM_EMAIL,
    };
    // sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    // sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
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

  async sendEmailVerificationMailViaBrevo(msg: any, user: User) {
    const apiInstance = new brevo.TransactionalEmailsApi();

    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = msg.subject;
    sendSmtpEmail.htmlContent = msg.html;
    sendSmtpEmail.sender = {
      name: 'Capital Connect',
      email: process.env.FROM_EMAIL,
    };
    sendSmtpEmail.to = [
      { email: msg.to, name: `${user.firstName} ${user.lastName}` },
    ];
    sendSmtpEmail.replyTo = {
      name: 'Capital Connect',
      email: process.env.FROM_EMAIL,
    };
    // sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    // sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
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
