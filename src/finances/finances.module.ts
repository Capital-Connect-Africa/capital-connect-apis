import { Module } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { FinancesController } from './finances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Finances } from './entities/finance.entity';
import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import { Revenue } from './entities/revenue.entity';
import { Opex } from './entities/opex.entity';
import { RevenuesService } from './revenues.service';
import { OpexService } from './opex.service';
import { OpexController } from './opex.controller';
import { RevenueController } from './revenues.controller';
import { CostOfSales } from './entities/costs.entity';
import { CostOfSalesService } from './costs.service';
import { CostOfSalesController } from './costs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ Finances, Company, User, Revenue, Opex, CostOfSales ])],
  controllers: [FinancesController, OpexController, RevenueController, CostOfSalesController],
  providers: [FinancesService, RevenuesService, OpexService, CostOfSalesService]})
export class FinancesModule {}
