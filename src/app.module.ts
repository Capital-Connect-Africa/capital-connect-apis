import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { SubsectionModule } from './subsection/subsection.module';
import { AnswerModule } from './answer/answer.module';
import { SectionModule } from './section/section.module';
import { QuestionModule } from './question/question.module';
import { SubmissionModule } from './submission/submission.module';
import { FilesModule } from './files/files.module';
import { S3Module } from './s3/s3.module';
import ormConfig from 'ormconfig';
import { SectorModule } from './sector/sector.module';
import { SubSectorModule } from './subsector/subsector.module';
import { LoggingMiddleware } from './logging.middleware';
import { CustomLogger } from './shared/utils/custom-logger.util';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScoringModule } from './scoring/scoring.module';
import { PaymentModule } from './payment/payment.module';
import { BookingModule } from './booking/booking.module';
import { CountryModule } from './country/country.module';
import { StageModule } from './stage/stage.module';
import { InvestmentStructuresModule } from './investment-structures/investment-structures.module';
import { MobileNumberModule } from './mobile/mobile-number.module';
import { InvestorProfileModule } from './investor-profile/investor-profile.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { ContactPersonModule } from './contact-person/contact-person.module';
import { UseOfFundsModule } from './use-of-funds/use-of-funds.module';
import { EsgFocusAreasModule } from './esg-focus/esg-focus-areas.module';
import { RegistrationStructuresModule } from './registration-structures/registration-structures.module';
import { InvestorTypesModule } from './investor-types/investor-types.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SpecialCriteriaModule } from './special-criteria/special-criteria.module';
import { SubscriptionTierModule } from './subscription_tier/subscription_tier.module';
import { BillingModule } from './billing/billing.module';
import { SegmentModule } from './segment/segment.module';
import { VoucherModule } from './voucher/voucher.module';
import { WebexIntegrationModule } from './webex_integration/webex_integration.module';
import { FinancesModule } from './finances/finances.module';
import { UserReferralModule } from './user-referral/user-referral.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigService available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ormConfig,
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Adjust the path to your templates directory
    }),
    AuthModule,
    UsersModule,
    CompanyModule,
    QuestionModule,
    SectionModule,
    AnswerModule,
    SubsectionModule,
    SubmissionModule,
    FilesModule,
    S3Module,
    SectorModule,
    SubSectorModule,
    ScoringModule,
    PaymentModule,
    BookingModule,
    CountryModule,
    StageModule,
    InvestmentStructuresModule,
    MobileNumberModule,
    InvestorProfileModule,
    MatchmakingModule,
    ContactPersonModule,
    UseOfFundsModule,
    EsgFocusAreasModule,
    RegistrationStructuresModule,
    InvestorTypesModule,
    StatisticsModule,
    SpecialCriteriaModule,
    SubscriptionTierModule,
    BillingModule,
    SegmentModule,
    VoucherModule,
    WebexIntegrationModule,
    FinancesModule,
    UserReferralModule,
  ],
  providers: [
    AppService,
    CustomLogger,
    {
      provide: 'CustomLogger',
      useClass: CustomLogger,
    },
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
