import { Test, TestingModule } from '@nestjs/testing';
import { InvestorsRepositoryService } from './investors-repository.service';

describe('InvestorsRepositoryService', () => {
  let service: InvestorsRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestorsRepositoryService],
    }).compile();

    service = module.get<InvestorsRepositoryService>(InvestorsRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
