import { Test, TestingModule } from '@nestjs/testing';
import { ValuticoController } from './valutico.controller';
import { ValuticoService } from './valutico.service';

describe('ValuticoController', () => {
  let controller: ValuticoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValuticoController],
      providers: [ValuticoService],
    }).compile();

    controller = module.get<ValuticoController>(ValuticoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
