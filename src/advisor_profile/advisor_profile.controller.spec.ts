import { Test, TestingModule } from '@nestjs/testing';
import { AdvisorProfileController } from './advisor_profile.controller';
import { AdvisorProfileService } from './advisor_profile.service';

describe('AdvisorProfileController', () => {
  let controller: AdvisorProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvisorProfileController],
      providers: [AdvisorProfileService],
    }).compile();

    controller = module.get<AdvisorProfileController>(AdvisorProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
