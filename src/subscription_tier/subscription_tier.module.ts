import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionTier } from './entities/subscription_tier.entity';
import { SubscriptionTierController } from './subscription_tier.controller';
import { SubscriptionTierService } from './subscription_tier.service';
import { User } from '../users/entities/user.entity';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { UserSubscription } from './entities/userSubscription.entity';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/entities/payment.entity';
import { HttpModule } from '@nestjs/axios';
import { PesapalMiddleware } from '../shared/pesapal-middleware.service';
import { TokenService } from '../shared/token.service';
import { VoucherService } from 'src/voucher/voucher.service';
import { Voucher } from 'src/voucher/entities/voucher.entity';
import { EligibilityRule } from 'src/voucher/entities/eligibility-rule.entity';
import { UserVoucher } from 'src/voucher/entities/user-voucher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionTier,
      User,
      UserSubscription,
      Payment,
      Voucher,
      EligibilityRule,
      UserVoucher,
    ]),
    HttpModule,
  ],
  controllers: [SubscriptionTierController, SubscriptionController],
  providers: [
    SubscriptionTierService,
    SubscriptionService,
    PaymentService,
    TokenService,
    VoucherService,
  ],
})
export class SubscriptionTierModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PesapalMiddleware)
      .forRoutes(
        { path: 'subscriptions/subscribe', method: RequestMethod.POST },
        { path: 'subscriptions/upgrade', method: RequestMethod.POST },
        { path: 'payments/:id', method: RequestMethod.GET },
      );
  }
}
