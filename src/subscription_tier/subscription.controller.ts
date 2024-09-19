import { Controller, Post, Param, ParseIntPipe, Get } from '@nestjs/common';
import { SubscriptionService } from "./subscription.service";

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post(':userId/:subscriptionId')
  async assignSubscription(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
  ) {
    return this.subscriptionService.assignSubscription(userId, subscriptionId);
  }

  @Get('validate/:userId')
  async validateSubscription(@Param('userId', ParseIntPipe) userId: number) {
    const hasSubscription = await this.subscriptionService.validateSubscription(userId);
    return { hasSubscription };
  }
}