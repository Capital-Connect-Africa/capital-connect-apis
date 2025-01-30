import { Test, TestingModule } from '@nestjs/testing';
import { ShuftiIntegrationController } from './shufti_integration.controller';
import { ShuftiIntegrationService } from './shufti_integration.service';

describe('ShuftiIntegrationController', () => {
  let controller: ShuftiIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShuftiIntegrationController],
      providers: [ShuftiIntegrationService],
    }).compile();

    controller = module.get<ShuftiIntegrationController>(ShuftiIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
