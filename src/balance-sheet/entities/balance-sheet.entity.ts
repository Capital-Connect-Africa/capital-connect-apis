import { Company } from "src/company/entities/company.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('balance_sheets')
export class BalanceSheet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    year: number;

    @ManyToOne(() => Company, (company) => company.balanceSheet)
    @JoinColumn({ name: 'companyId' })
    company: Company;

    //Assets
    @Column('bigint', { default: 0 })
    landProperty: number;

    @Column('bigint', { default: 0 })
    plantEquipment: number;

    @Column('bigint', { default: 0 })
    otherNonCurrentAssets: number;

    @Column('bigint', { default: 0 })
    tradeReceivables: number;

    @Column('bigint', { default: 0 })
    cash: number;

    @Column('bigint', { default: 0 })
    inventory: number;

    @Column('bigint', { default: 0 })
    otherCurrentAssets: number;

    @Column('bigint', { default: 0 })
    totalAssets: number;

    //Liabilities
    @Column('bigint', { default: 0 })
    tradePayables: number;

    @Column('bigint', { default: 0 })
    otherCurrentLiabilities: number;

    @Column('bigint', { default: 0 })
    loans: number;

    @Column('bigint', { default: 0 })
    capital: number;

    @Column('bigint', { default: 0 })
    otherNonCurrentLiabilities: number;

    @Column('bigint', { default: 0 })
    totalLiabilities: number;

    //Calculations
    @BeforeInsert()
    @BeforeUpdate()
    calculateFields() {
        this.totalAssets = this.landProperty + this.plantEquipment + this.otherNonCurrentAssets + 
                           this.tradeReceivables + this.cash + this.inventory + this.otherCurrentAssets;
                           
        this.totalLiabilities = this.tradePayables + this.otherCurrentLiabilities + this.loans + 
                                this.capital + this.otherNonCurrentLiabilities;
    }
}
