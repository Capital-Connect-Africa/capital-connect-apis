import { Test, TestingModule } from '@nestjs/testing';
import { CountryCodesService } from './country-codes.service';

describe('CountryCodesService', () => {
  let service: CountryCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountryCodesService],
    }).compile();

    service = module.get<CountryCodesService>(CountryCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
