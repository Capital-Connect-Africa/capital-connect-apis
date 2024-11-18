import { Module } from '@nestjs/common';
import { ContactPersonService } from './contact-person.service';
import { ContactPersonController } from './contact-person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactPerson } from './entities/contact-person.entity';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { InvestorProfile } from '../investor-profile/entities/investor-profile.entity';
import { Sector } from '../sector/entities/sector.entity';
import { SubSector } from '../subsector/entities/subsector.entity';
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      ContactPerson,
      InvestorProfile,
      Sector,
      SubSector,
      User,
    ]),
  ],
  controllers: [ContactPersonController],
  providers: [ContactPersonService, AuthService, UsersService],
})
export class ContactPersonModule {}
