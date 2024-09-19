import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionTier } from './entities/subscription_tier.entity';
import { SubscriptionTierController } from './subscription_tier.controller';
import { SubscriptionTierService } from './subscription_tier.service';
import { User } from "../users/entities/user.entity";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionTier, User])],
  controllers: [SubscriptionTierController, SubscriptionController],
  providers: [SubscriptionTierService, SubscriptionService],
})
export class SubscriptionTierModule {}
