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



  async sendAdvisoryRemarksEmailViaBrevo(msg: any, user: User) {
    console.log("********************TRYING THE EMAIL FUNCTION*****************************")

    const apiInstance = new brevo.TransactionalEmailsApi();
  
    try {
      if (!process.env.BREVO_API_KEY || !process.env.FROM_EMAIL) {
        throw new Error('Brevo API key or FROM_EMAIL is missing in environment variables');
      }


     console.log("********************FINAL STEP*****************************")

  
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
  
      const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Brevo API success:', JSON.stringify(response));
      return response;  
  
    } catch (error) {
      console.error('Brevo API error:', {
        message: error.message,
        statusCode: error.statusCode,
        body: error.body,
        stack: error.stack,
      });
  
      if (error.statusCode === 401) {
        throw new Error('Failed to send email: Invalid or missing Brevo API key');
      } else if (error.statusCode >= 500) {
        throw new Error('Failed to send email: Brevo API server error');
      } else {
        throw new Error(`Failed to send email: ${error.message}`);
      }
    }
  }

}
