import { Test, TestingModule } from '@nestjs/testing';
import { SpecialCriteriaService } from './special-criteria.service';

describe('SpecialCriteriaService', () => {
  let service: SpecialCriteriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialCriteriaService],
    }).compile();

    service = module.get<SpecialCriteriaService>(SpecialCriteriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
