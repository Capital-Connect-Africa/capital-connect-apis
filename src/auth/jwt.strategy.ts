import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { 
      id: payload.sub, 
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username, 
      roles: payload.roles,
      hasAcceptedTerms: payload.hasAcceptedTerms,
      subscriptionTier: payload.subscriptionTier,
    };
  }
}
