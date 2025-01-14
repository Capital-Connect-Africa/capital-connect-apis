import { SetMetadata } from '@nestjs/common';
import { SubscriptionTierEnum } from './subscription-tier.enum';

// Define the metadata key
export const SUBSCRIPTIONS_KEY = 'subscriptions';

// Create the custom decorator
export const Subscriptions = (...subscriptions: SubscriptionTierEnum[]) =>
  SetMetadata(SUBSCRIPTIONS_KEY, subscriptions);
