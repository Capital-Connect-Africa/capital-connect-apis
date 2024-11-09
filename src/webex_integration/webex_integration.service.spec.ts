import { Test, TestingModule } from '@nestjs/testing';
import { WebexIntegrationService } from './webex_integration.service';

describe('WebexIntegrationService', () => {
  let service: WebexIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebexIntegrationService],
    }).compile();

    service = module.get<WebexIntegrationService>(WebexIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
