import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CashflowStatement } from "./entities/cash-flows.entity";
import { Repository } from "typeorm";
import { BalanceSheet } from "./entities/balance-sheet.entity";
import { Finances } from "src/finances/entities/finance.entity";
import { Company } from "src/company/entities/company.entity";

@Injectable()
export class CashflowService {
  constructor(
    @InjectRepository(CashflowStatement)
    private cashflowRepository: Repository<CashflowStatement>,
    @InjectRepository(BalanceSheet)
    private balanceSheetRepository: Repository<BalanceSheet>,
    @InjectRepository(Finances)
    private financesRepository: Repository<Finances>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async generateCashflow(companyId: number, year: number): Promise<CashflowStatement> {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const balanceSheet = await this.balanceSheetRepository.findOne({ where: { company: { id: companyId }, year } });
    console.log('Balance Sheet:', balanceSheet);
    const finances = await this.financesRepository.findOne({ where: { company: { id: companyId }, year } });
    console.log('Finances:', finances);

    if (!balanceSheet || !finances) {
      throw new NotFoundException('Balance sheet or financial data not found for this year');
    }

    const cashflow = new CashflowStatement();
    cashflow.company = company;
    cashflow.year = year;
    cashflow.balanceSheet = balanceSheet;
    cashflow.finances = finances;

    cashflow.calculateFields();

    return this.cashflowRepository.save(cashflow);
  }
}