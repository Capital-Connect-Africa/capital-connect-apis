import { Test, TestingModule } from '@nestjs/testing';
import { SpecialCriteriaController } from './special-criteria.controller';
import { SpecialCriteriaService } from './special-criteria.service';

describe('SpecialCriteriaController', () => {
  let controller: SpecialCriteriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialCriteriaController],
      providers: [SpecialCriteriaService],
    }).compile();

    controller = module.get<SpecialCriteriaController>(SpecialCriteriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
