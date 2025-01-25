import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
import { Role } from './role.enum';
import * as sgMail from '@sendgrid/mail';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';
import { welcomeEmailTemplate } from '../templates/welcome-email';
import { SubscriptionTierEnum } from '../subscription/subscription-tier.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactPerson } from 'src/contact-person/entities/contact-person.entity';
import { Repository } from 'typeorm';
import { generateCryptCode } from 'src/shared/helpers/crypto-generator.helper';
const brevo = require('@getbrevo/brevo');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ContactPerson)
    private contactPersonRepository: Repository<ContactPerson>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
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
      if (!user.referralCode) {
        const referralCode = generateCryptCode(8);
        await this.usersService.update(user.id, { referralCode });
      }
      if (!user.isEmailVerified) {
        throw new BadRequestException(
          'Your email is not verified. Check your email for verification link and click on it to verify your email. If you did not receive the email, click on the resend verification email link below.',
        );
      }

      const userRoles = user.roles?.split(',').map((role) => role.trim());

      if (userRoles.includes(Role.ContactPerson)) {
        const contactPerson = await this.contactPersonRepository.findOne({
          where: { emailAddress: user.username },
          select: ['hasAccess'],
        });

        if (!contactPerson?.hasAccess) {
          throw new BadRequestException(
            'Access denied. Please contact the administrator to gain access.',
          );
        }
      }

      const subscriptions = user.subscriptions;
      const subscriptionTier = subscriptions?.find(
        (subscription) => subscription.isActive,
      )?.subscriptionTier?.name;
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        sub: user.id,
        referralCode: user.referralCode,
        roles: userRoles || [Role.User],
        hasAcceptedTerms: user.hasAcceptedTerms,
        subscriptionTier: subscriptionTier || SubscriptionTierEnum.BASIC,
      };

      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
      };
    }

    throw new BadRequestException('Invalid username or password');
  }

  async signup(user: Partial<User>) {
    const isEmailValid = this.usersService.validateEmail(user.username);
    if (!isEmailValid) {
      throw new BadRequestException('Invalid email format');
    }
    const isUsernameTaken = await this.usersService.isUsernameTaken(
      user.username,
    );
    if (isUsernameTaken) {
      throw new BadRequestException('Username is already taken');
    }
    if (
      user.roles &&
      [Role.Advisor, Role.Investor, Role.User].indexOf(user.roles as Role) ===
        -1
    ) {
      throw new BadRequestException('Invalid role');
    }
    // Check if user has accepted terms
    if (!user.hasAcceptedTerms) {
      throw new BadRequestException(
        'You must accept the terms and conditions before signing up.',
      );
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
      html: welcomeEmailTemplate(verificationUrl),
    };

    // await this.sendEmailVerificatioinMailViaSendGrid(msg);
    await this.sendEmailVerificationMailViaBrevo(msg, user);
  }

  async sendEmailVerificatioinMailViaSendGrid(msg: any) {
    await sgMail.send(msg);
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
