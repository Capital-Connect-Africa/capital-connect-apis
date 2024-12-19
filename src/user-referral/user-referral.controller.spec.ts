import { Test, TestingModule } from '@nestjs/testing';
import { UserReferralController } from './user-referral.controller';

describe('UserReferralController', () => {
  let controller: UserReferralController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserReferralController],
    }).compile();

    controller = module.get<UserReferralController>(UserReferralController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
