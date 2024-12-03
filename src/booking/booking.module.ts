import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { PaymentService } from 'src/payment/payment.service';
import { HttpModule } from '@nestjs/axios';
import { TokenService } from 'src/shared/token.service';
import { PesapalMiddleware } from 'src/shared/pesapal-middleware.service';
import { SubscriptionTier } from '../subscription_tier/entities/subscription_tier.entity';
import { UserSubscription } from '../subscription_tier/entities/userSubscription.entity';
import { VoucherService } from 'src/voucher/voucher.service';
import { EligibilityRule } from 'src/voucher/entities/eligibility-rule.entity';
import { Voucher } from 'src/voucher/entities/voucher.entity';
import { User } from 'src/users/entities/user.entity';
import { UserVoucher } from 'src/voucher/entities/user-voucher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Payment,
      SubscriptionTier,
      UserSubscription,
      EligibilityRule,
      Voucher,
      User,
      UserVoucher,
    ]),
    HttpModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, PaymentService, TokenService, VoucherService],
})
export class BookingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PesapalMiddleware)
      .forRoutes(
        { path: 'bookings', method: RequestMethod.POST },
        { path: 'payments/:id', method: RequestMethod.GET },
      );
  }
}
