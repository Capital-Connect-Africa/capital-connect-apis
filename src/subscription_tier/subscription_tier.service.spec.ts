import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionTierService } from './subscription_tier.service';

describe('SubscriptionTierService', () => {
  let service: SubscriptionTierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionTierService],
    }).compile();

    service = module.get<SubscriptionTierService>(SubscriptionTierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
