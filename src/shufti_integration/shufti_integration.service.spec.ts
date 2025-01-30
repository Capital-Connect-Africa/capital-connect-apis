import { Test, TestingModule } from '@nestjs/testing';
import { ShuftiIntegrationService } from './shufti_integration.service';

describe('ShuftiIntegrationService', () => {
  let service: ShuftiIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShuftiIntegrationService],
    }).compile();

    service = module.get<ShuftiIntegrationService>(ShuftiIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
