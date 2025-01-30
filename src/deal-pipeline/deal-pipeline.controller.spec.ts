import { Test, TestingModule } from '@nestjs/testing';
import { DealPipelineController } from './deal-pipeline.controller';

describe('DealPipelineController', () => {
  let controller: DealPipelineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DealPipelineController],
    }).compile();

    controller = module.get<DealPipelineController>(DealPipelineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
