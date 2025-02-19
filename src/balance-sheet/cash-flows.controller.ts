import { Controller, Get, Param } from "@nestjs/common";
import { CashflowService } from "./cash-flows.service";
import { CashflowStatement } from "./entities/cash-flows.entity";

@Controller('cashflow')
export class CashflowController {
  constructor(private readonly cashflowService: CashflowService) {}

  @Get(':companyId/:year')
  async getCashflow(
    @Param('companyId') companyId: number,
    @Param('year') year: number,
  ): Promise<CashflowStatement> {
    return this.cashflowService.generateCashflow(companyId, year);
  }
}