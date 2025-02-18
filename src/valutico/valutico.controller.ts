import { Body, Controller, Get, Post } from '@nestjs/common';
import { ValuticoService } from './valutico.service';

@Controller('valutico')
export class ValuticoController {
  constructor(private readonly valuticoService: ValuticoService) {}

  @Get()
  async getMarketplace() {
    return this.valuticoService.getMarketplace();
  }

  @Post('valuations')
  async submitValuation(@Body() valuationData: any) {
    return this.valuticoService.submitValuation(valuationData);
  }
}
