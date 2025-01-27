import { Module } from '@nestjs/common';
import { UserReferralService } from './user-referral.service';
import { UserReferralController } from './user-referral.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Referral } from './entities/referral.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [UserReferralService, UsersService],
  controllers: [UserReferralController],
  imports: [TypeOrmModule.forFeature([Referral, User])],
})
export class UserReferralModule {}
