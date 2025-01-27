import { Test, TestingModule } from '@nestjs/testing';
import { DealPipelineService } from './deal-pipeline.service';

describe('DealPipelineService', () => {
  let service: DealPipelineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DealPipelineService],
    }).compile();

    service = module.get<DealPipelineService>(DealPipelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
