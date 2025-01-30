import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { SUBSCRIPTIONS_KEY } from "./subscriptions.decorators";
import { SubscriptionTierEnum } from "./subscription-tier.enum";

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<SubscriptionTierEnum[]>(SUBSCRIPTIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No subscriptions required, grant access
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      console.error('Access Denied: No user found.');
      return false; // No user found, deny access
    }

    // If the user's role is not 'user', grant access without checking subscription
    if (user.roles && !user.roles.includes('user')) {
      return true;
    }

    // For 'user' role, check the subscription
    if (!user.subscriptionTier) {
      console.error('Access Denied: User has no subscriptionTier.');
      return false; // User has no subscriptionTier, deny access
    }

    const userSubscriptions = Array.isArray(user.subscriptionTier)
      ? user.subscriptionTier
      : [user.subscriptionTier];

    const hasAccess = requiredRoles.some((subscription) => userSubscriptions.includes(subscription));

    if (!hasAccess) {
      console.warn(`Access Denied: User ${user.id} lacks required subscriptions.`);
    }

    return hasAccess;
  }
}


