import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PesapalMiddleware } from '../shared/pesapal-middleware.service';
import { TokenService } from '../shared/token.service';
import { UserSubscription } from '../subscription_tier/entities/userSubscription.entity';
import { SubscriptionTier } from '../subscription_tier/entities/subscription_tier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, SubscriptionTier, UserSubscription]),
    HttpModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, TokenService],
})
export class PaymentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PesapalMiddleware)
      .forRoutes(
        { path: 'payments/callback', method: RequestMethod.POST },
        { path: 'payments/status', method: RequestMethod.GET },
        { path: 'payments/:id', method: RequestMethod.GET },
      );
  }
}
