import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { PaymentService } from 'src/payment/payment.service';
import { HttpModule } from '@nestjs/axios';
import { TokenService } from 'src/shared/token.service';
import { AuthMiddleware } from 'src/shared/auth.middleware';
import { SubscriptionTier } from '../subscription_tier/entities/subscription_tier.entity';
import { UserSubscription } from '../subscription_tier/entities/userSubscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Payment,
      SubscriptionTier,
      UserSubscription,
    ]),
    HttpModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, PaymentService, TokenService],
})
export class BookingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'bookings', method: RequestMethod.POST },
        { path: 'payments/:id', method: RequestMethod.GET },
      );
  }
}
