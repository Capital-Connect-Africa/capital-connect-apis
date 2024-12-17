import { Module } from '@nestjs/common';
import { UserReferralService } from './user-referral.service';
import { UserReferralController } from './user-referral.controller';

@Module({
  providers: [UserReferralService],
  controllers: [UserReferralController]
})
export class UserReferralModule {}
