import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionTierEnum } from '../subscription/subscription-tier.enum';
import { Observable } from 'rxjs';

@Injectable()
export class BillingTierGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredTier = this.reflector.get<SubscriptionTierEnum>(
      'subscriptionTier',
      context.getHandler(),
    );

    if (!requiredTier) {
      return true; // If no tier is required, allow access
    }

    const { user } = context.switchToHttp().getRequest();

    if (user.roles && !user.roles.includes('user')) {
      return true;
    }

    // Assuming the user's subscription tier is stored in the user object
    if (!user || !user.subscriptionTier) {
      throw new ForbiddenException('Subscription tier is missing.');
    }

    const userTier = user.subscriptionTier as SubscriptionTierEnum;

    // You might want to define an order of precedence to compare tiers
    const tierOrder = [
      SubscriptionTierEnum.BASIC,
      SubscriptionTierEnum.PLUS,
      SubscriptionTierEnum.PRO,
      SubscriptionTierEnum.ELITE,
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
