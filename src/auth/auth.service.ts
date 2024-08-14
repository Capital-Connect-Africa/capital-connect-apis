import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
import { Role } from './role.enum';
import * as sgMail from '@sendgrid/mail';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';
const brevo = require('@getbrevo/brevo');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

async login(username: string, password: string) {
  if (!username || !password) {
    throw new BadRequestException('Username and password are required');
  }

  const user = await this.validateUser(username, password);
  if (user) {
      if (!user.isEmailVerified) {
        throw new BadRequestException('Your email is not verified. Check your email for verification link and click on it to verify your email. If you did not receive the email, click on the resend verification email link below.');
      }
      const userRoles = user.roles?.split(",").map(role => role.trim());
      const payload = { 
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username, 
        sub: user.id, 
        roles: userRoles || [Role.User]
      };
      return {
          access_token: this.jwtService.sign(payload),
      };
  }
  throw new BadRequestException('Invalid username or password');
}

  async signup(user: Partial<User>) {
    const isEmailValid = this.usersService.validateEmail(user.username);
    if (!isEmailValid) {
      throw new BadRequestException('Invalid email format');
    }
    const isUsernameTaken = await this.usersService.isUsernameTaken(user.username);
    if (isUsernameTaken) {
      throw new BadRequestException('Username is already taken');
    }
    if (user.roles && [Role.Advisor, Role.Investor, Role.User].indexOf(user.roles as Role) === -1) {
      throw new BadRequestException('Invalid role');
    }
    user.emailVerificationToken = randomBytes(32).toString('hex');
    user.emailVerificationExpires = addHours(new Date(), 24);
    return this.usersService.create(user);
  }

  async sendVerificationEmail(user: User) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/?token=${user.emailVerificationToken}`;
    const msg = {
      to: user.username,
      from: process.env.FROM_EMAIL, // Use your verified sender
      subject: 'Email Verification',
      text: `You are receiving this email because you (or someone else) have signed up for an account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the verification process:\n\n` +
            `${verificationUrl}\n\n` +
            `If you did not request this, please ignore this email.\n`,
    };

    // await this.sendEmailVerificatioinMailViaSendGrid(msg);
    await this.sendEmailVerificatioinMailViaBrevo(msg, user);
  }

  async sendEmailVerificatioinMailViaSendGrid(msg: any){
    await sgMail.send(msg);
  }

  async sendEmailVerificatioinMailViaBrevo(msg: any, user: User){
    let apiInstance = new brevo.TransactionalEmailsApi();

    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = msg.subject;
    sendSmtpEmail.htmlContent = `<html><body><h1>Follow instructions below to verify you email address</h1><p>${msg.text}</p></body></html>`;
    sendSmtpEmail.sender = { "name": "Capital Connect", "email": process.env.FROM_EMAIL };
    sendSmtpEmail.to = [
      { "email": msg.to, "name": `${user.firstName} ${user.lastName}` }
    ];
    sendSmtpEmail.replyTo = { "name": "Capital Connect", "email": process.env.FROM_EMAIL };
    // sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    // sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
      console.error(error);
    });
  }
}
