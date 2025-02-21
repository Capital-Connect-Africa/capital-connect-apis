import { Company } from "src/company/entities/company.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BalanceSheet } from "./balance-sheet.entity";
import { Finances } from "src/finances/entities/finance.entity";

@Entity('cashflows')
export class CashflowStatement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @ManyToOne(() => Company, (company) => company.cashflowStatements)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => BalanceSheet)
  @JoinColumn({ name: 'balanceSheetId' })
  balanceSheet: BalanceSheet;

  @ManyToOne(() => Finances)
  @JoinColumn({ name: 'financesId' })
  finances: Finances;

  // Operating Cash Flow
  @Column('bigint', { default: 0 })
  profitBeforeTax: number;

  @Column('bigint', { default: 0 })
  depreciationAmortisation: number;

  @Column('bigint', { default: 0 })
  taxesPaid: number;

  @Column('bigint', { default: 0 })
  operatingCashFlow: number;

  // Working Capital Changes
  @Column('bigint', { default: 0 })
  changeInReceivables: number;

  @Column('bigint', { default: 0 })
  changeInPayables: number;

  @Column('bigint', { default: 0 })
  netCashFromOperations: number;

  // Investing Activities
  @Column('bigint', { default: 0 })
  propertyPlantEquipment: number;

  @Column('bigint', { default: 0 })
  netCashFromInvesting: number;

  // Financing Activities
  @Column('bigint', { default: 0 })
  movementInBorrowings: number;

  @Column('bigint', { default: 0 })
  changeInEquity: number;

  @Column('bigint', { default: 0 })
  netCashFromFinancing: number;

  // Net Cash Flow
  @Column('bigint', { default: 0 })
  netCashFlow: number;

  @Column('bigint', { default: 0 })
  openingCash: number;

  @Column('bigint', { default: 0 })
  endingCash: number;

  @BeforeInsert()
  @BeforeUpdate()
  calculateFields() {
    // Fetch values from related entities
    this.profitBeforeTax = this.finances?.profitBeforeTax || 0;
    this.depreciationAmortisation = this.finances?.amorDep || 0;
    this.taxesPaid = this.finances?.taxes || 0;

    // Compute operating cash flow
    this.operatingCashFlow = Number(this.profitBeforeTax) + Number(this.depreciationAmortisation) - 
        Number(this.taxesPaid);

    // Working capital changes
    this.changeInReceivables = this.balanceSheet?.tradeReceivables || 0;
    this.changeInPayables = this.balanceSheet?.tradePayables || 0;
    this.netCashFromOperations = Number(this.operatingCashFlow) + Number(this.changeInPayables) + 
        Number(this.changeInReceivables);

    // Investing Activities
    this.propertyPlantEquipment = this.balanceSheet?.plantEquipment || 0;
    this.netCashFromInvesting = this.propertyPlantEquipment;

    // Financing Activities
    this.movementInBorrowings = this.balanceSheet?.loans || 0;
    this.changeInEquity = this.balanceSheet?.capital || 0;
    this.netCashFromFinancing = Number(this.movementInBorrowings) + Number(this.changeInEquity);

    // Net Cash Flow
    this.netCashFlow = Number(this.netCashFromOperations) + Number(this.netCashFromInvesting) + 
        Number(this.netCashFromFinancing);

    // Ending Cash
    this.openingCash = this.balanceSheet?.cash || 0;
    this.endingCash = Number(this.openingCash) + Number(this.netCashFlow);
  }
}