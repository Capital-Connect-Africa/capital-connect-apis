import { Controller, Get, UseGuards } from '@nestjs/common';
import { BillingTierGuard } from '../guards/billing-tier.guard';
import { SubscriptionTierRequired } from '../decorators/subscription-tier.decorator';
import { SubscriptionTier } from '../subscription/subscription-tier.enum';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller('billing')
@UseGuards(JwtAuthGuard, BillingTierGuard)
export class BillingController {
  @Get('open-feature')
  openFeature() {
    return { message: 'This is an open feature.' };
  }

  @Get('basic-feature')
  @SubscriptionTierRequired(SubscriptionTier.BASIC)
  accessBasicFeature() {
    return { message: 'This is a basic feature.' };
  }

  @Get('pro-feature')
  @SubscriptionTierRequired(SubscriptionTier.PRO)
  accessProFeature() {
    return { message: 'This is a pro feature.' };
  }

  @Get('elite-feature')
  @SubscriptionTierRequired(SubscriptionTier.ELITE)
  accessEliteFeature() {
    return { message: 'This is an elite feature.' };
  }
}