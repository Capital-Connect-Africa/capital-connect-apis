import { SetMetadata } from '@nestjs/common';
import { SubscriptionTier } from '../subscription/subscription-tier.enum';

export const SubscriptionTierRequired = (tier: SubscriptionTier) =>
  SetMetadata('subscriptionTier', tier);
