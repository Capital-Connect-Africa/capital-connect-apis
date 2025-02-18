import { Test, TestingModule } from '@nestjs/testing';
import { ValuticoService } from './valutico.service';

describe('ValuticoService', () => {
  let service: ValuticoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValuticoService],
    }).compile();

    service = module.get<ValuticoService>(ValuticoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
