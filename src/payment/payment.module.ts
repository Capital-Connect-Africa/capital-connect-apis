import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AuthMiddleware } from '../shared/auth.middleware';
import { TokenService } from '../shared/token.service';
import { UserSubscription } from '../subscription_tier/entities/userSubscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, UserSubscription]), HttpModule],
  controllers: [PaymentController],
  providers: [PaymentService, TokenService],
})
export class PaymentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'payments/callback', method: RequestMethod.POST },
        { path: 'payments/status', method: RequestMethod.GET },
        { path: 'payments/:id', method: RequestMethod.GET },
      );
  }
}
