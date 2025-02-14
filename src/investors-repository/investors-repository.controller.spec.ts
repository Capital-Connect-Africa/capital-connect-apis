import { Test, TestingModule } from '@nestjs/testing';
import { InvestorsRepositoryController } from './investors-repository.controller';

describe('InvestorsRepositoryController', () => {
  let controller: InvestorsRepositoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestorsRepositoryController],
    }).compile();

    controller = module.get<InvestorsRepositoryController>(InvestorsRepositoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
