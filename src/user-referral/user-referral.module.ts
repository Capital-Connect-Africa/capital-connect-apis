import { Module } from '@nestjs/common';
import { UserReferralService } from './user-referral.service';
import { UserReferralController } from './user-referral.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Referral } from './entities/referral.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserReferralService, JwtService],
  controllers: [UserReferralController],
  imports: [TypeOrmModule.forFeature([Referral, User])],
  exports: [UserReferralService, JwtService]
})
export class UserReferralModule {}
