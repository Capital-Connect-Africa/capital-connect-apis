import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ValuticoService } from './valutico.service';

@Controller('valutico')
export class ValuticoController {
  constructor(private readonly valuticoService: ValuticoService) {}

  @Get(':myValuticoId')
  async getMarketplace(@Param('myValuticoId') myValuticoId: string) {
    return this.valuticoService.getMarketplace(myValuticoId);
  }

  @Post(':myValuticoId/valuations')
  async submitValuation(
    @Param('myValuticoId') myValuticoId: string,
    @Body() valuationData: any,
  ) {
    return this.valuticoService.submitValuation(myValuticoId, valuationData);
  }
}
