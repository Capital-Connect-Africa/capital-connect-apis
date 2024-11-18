import { Test, TestingModule } from '@nestjs/testing';
import { WebexIntegrationController } from './webex_integration.controller';
import { WebexIntegrationService } from './webex_integration.service';

describe('WebexIntegrationController', () => {
  let controller: WebexIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebexIntegrationController],
      providers: [WebexIntegrationService],
    }).compile();

    controller = module.get<WebexIntegrationController>(WebexIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
