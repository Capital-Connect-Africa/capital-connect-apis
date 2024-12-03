import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { WebexIntegrationService } from './webex_integration.service';
import { WebexIntegrationController } from './webex_integration.controller';
import { WebexTokenMiddleware } from '../shared/webex-middleware.service';
import { HttpModule } from '@nestjs/axios';
import { BookingService } from '../booking/booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../booking/entities/booking.entity';
import { VoucherService } from 'src/voucher/voucher.service';
import { Voucher } from 'src/voucher/entities/voucher.entity';
import { EligibilityRule } from 'src/voucher/entities/eligibility-rule.entity';
import { User } from 'src/users/entities/user.entity';
import { UserVoucher } from 'src/voucher/entities/user-voucher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Voucher, EligibilityRule, User, UserVoucher]), HttpModule],
  controllers: [WebexIntegrationController],
  providers: [WebexIntegrationService, BookingService, VoucherService],
})
export class WebexIntegrationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WebexTokenMiddleware)
      .forRoutes(
        { path: 'webex/create', method: RequestMethod.POST },
        { path: 'webex/:id', method: RequestMethod.GET },
      );
  }
}
