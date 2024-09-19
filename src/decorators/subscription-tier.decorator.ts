import { SetMetadata } from '@nestjs/common';
import { SubscriptionTierEnum } from '../subscription/subscription-tier.enum';

export const SubscriptionTierRequired = (tier: SubscriptionTierEnum) =>
  SetMetadata('subscriptionTier', tier);
