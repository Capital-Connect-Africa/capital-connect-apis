import { Controller, Post, Param, ParseIntPipe, Get, UseGuards } from '@nestjs/common';
import { SubscriptionService } from "./subscription.service";
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post(':userId/:subscriptionId')
  @Roles(Role.Admin)
  async assignSubscription(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
  ) {
    return this.subscriptionService.assignSubscription(userId, subscriptionId);
  }

  @Get('validate/:userId')
  @Roles(Role.Admin)
  async validateSubscription(@Param('userId', ParseIntPipe) userId: number) {
    const hasSubscription = await this.subscriptionService.validateSubscription(userId);
    return { hasSubscription };
  }
}