import { Module } from '@nestjs/common';
import { UserReferralController } from './user-referral.controller';
import { UserReferralService } from './user-referral.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Referral } from './entities/referral.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserReferralController],
  providers: [UserReferralService, JwtService],
  imports: [TypeOrmModule.forFeature([User, Referral])],
  exports: [UserReferralService]
})
export class UserReferralModule {}
