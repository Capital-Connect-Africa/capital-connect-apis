import { Module } from '@nestjs/common';
import { BalanceSheetService } from './balance-sheet.service';
import { BalanceSheetController } from './balance-sheet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceSheet } from './entities/balance-sheet.entity';
import { Company } from 'src/company/entities/company.entity';
import { Finances } from 'src/finances/entities/finance.entity';
import { CashflowStatement } from './entities/cash-flows.entity';
import { CashflowController } from './cash-flows.controller';
import { CashflowService } from './cash-flows.service';

@Module({
  imports: [TypeOrmModule.forFeature([ BalanceSheet, Company, Finances, CashflowStatement])],
  controllers: [BalanceSheetController, CashflowController],
  providers: [BalanceSheetService, CashflowService],
})
export class BalanceSheetModule {}
