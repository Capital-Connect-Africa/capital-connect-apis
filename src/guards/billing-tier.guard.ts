import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionTier } from '../subscription/subscription-tier.enum';
import { Observable } from 'rxjs';

@Injectable()
export class BillingTierGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredTier = this.reflector.get<SubscriptionTier>(
      'subscriptionTier',
      context.getHandler(),
    );

    if (!requiredTier) {
      return true; // If no tier is required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Assuming the user's subscription tier is stored in the user object
    if (!user || !user.subscriptionTier) {
      throw new ForbiddenException('Subscription tier is missing.');
    }

    const userTier = user.subscriptionTier as SubscriptionTier;

    // You might want to define an order of precedence to compare tiers
    const tierOrder = [
      SubscriptionTier.BASIC,
      SubscriptionTier.PLUS,
      SubscriptionTier.PRO,
      SubscriptionTier.ELITE,
    ];

    const userTierIndex = tierOrder.indexOf(userTier);
    const requiredTierIndex = tierOrder.indexOf(requiredTier);

    if (userTierIndex < requiredTierIndex) {
      throw new ForbiddenException(
        `Access denied. Required subscription tier: ${requiredTier}. Your tier: ${userTier}`,
      );
    }

    return true;
  }
}
