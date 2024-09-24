import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionTierController } from './subscription_tier.controller';
import { SubscriptionTierService } from './subscription_tier.service';

describe('SubscriptionTierController', () => {
  let controller: SubscriptionTierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionTierController],
      providers: [SubscriptionTierService],
    }).compile();

    controller = module.get<SubscriptionTierController>(SubscriptionTierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
