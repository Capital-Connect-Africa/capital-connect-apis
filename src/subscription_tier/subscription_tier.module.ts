import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionTierEntity } from './entities/subscription_tier.entity';
import { SubscriptionTierController } from './subscription_tier.controller';
import { SubscriptionTierService } from './subscription_tier.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionTierEntity])],
  controllers: [SubscriptionTierController],
  providers: [SubscriptionTierService],
})
export class SubscriptionTierModule {}
