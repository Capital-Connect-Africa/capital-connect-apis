import { Module } from '@nestjs/common';
import { ValuticoService } from './valutico.service';
import { ValuticoController } from './valutico.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ValuticoController],
  providers: [ValuticoService],
})
export class ValuticoModule {}
