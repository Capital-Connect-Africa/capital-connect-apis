import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { WebexIntegrationService } from './webex_integration.service';
import { WebexIntegrationController } from './webex_integration.controller';
import { WebexTokenMiddleware } from '../shared/webex-middleware.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WebexIntegrationController],
  providers: [WebexIntegrationService],
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
