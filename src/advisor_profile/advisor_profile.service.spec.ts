import { Test, TestingModule } from '@nestjs/testing';
import { AdvisorProfileService } from './advisor_profile.service';

describe('AdvisorProfileService', () => {
  let service: AdvisorProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvisorProfileService],
    }).compile();

    service = module.get<AdvisorProfileService>(AdvisorProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
