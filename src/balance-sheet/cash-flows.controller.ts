import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { CashflowService } from "./cash-flows.service";
import { CashflowStatement } from "./entities/cash-flows.entity";
import { RolesGuard } from "src/auth/roles.guard";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
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