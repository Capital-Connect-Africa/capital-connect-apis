import { Module } from '@nestjs/common';
import { BalanceSheetService } from './balance-sheet.service';
import { BalanceSheetController } from './balance-sheet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceSheet } from './entities/balance-sheet.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ BalanceSheet, Company ])],
  controllers: [BalanceSheetController],
  providers: [BalanceSheetService],
})
export class BalanceSheetModule {}
