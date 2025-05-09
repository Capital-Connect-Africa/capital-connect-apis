import { 
  AfterUpdate,
    BeforeInsert,
    BeforeUpdate,
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn 
} from "typeorm";
import { FinanceStatus } from "../finance.enum";
import { Company } from "src/company/entities/company.entity";
import { File } from "src/files/entities/file.entity";
import { Revenue } from "./revenue.entity";
import { Opex } from "./opex.entity";
import { User } from "src/users/entities/user.entity";
import { CostOfSales } from "./costs.entity";

@Entity('finances')
export class Finances {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', default: () => `date_part('year', now())::INTEGER` })
    year: number; 

    @Column('bigint', { default: 0 })
    amorDep: number;

    @Column('bigint', { default: 0 })
    interests: number;

    @Column('bigint', { default: 0 })
    taxes: number;
  
    @CreateDateColumn()
    createdAt: Date; 

    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column({ type: 'enum', enum: FinanceStatus, default: 'pending' })
    status: FinanceStatus; 
  
    @Column('text', { nullable: true })
    notes: string;

    @OneToMany(() => Revenue, (revenue) => revenue.finances, { cascade: true })
    revenues: Revenue[];

    @OneToMany(() => Opex, (opex) => opex.finances, { cascade: true })
    opex: Opex[];

    @OneToMany(() => CostOfSales, (costOfSales) => costOfSales.finances, { cascade: true })
    costOfSales: CostOfSales[];

    @OneToOne(() => File)
    @JoinColumn()
    attachments: File;

    @ManyToOne(() => Company, (company) => company.finances)
    @JoinColumn({ name: 'companyId' })
    company: Company;
    
    @ManyToOne(() => User, (user) => user.finances)
    @JoinColumn({ name: 'userId' })
    user: User; 

    @Column('bigint', { nullable: true })
    totalRevenues?: number;

    @Column('bigint', { nullable: true })
    totalCosts?: number;

    @Column('bigint', { nullable: true })
    grossProfit?: number;

    @Column('bigint', { nullable: true })
    ebitda?: number;

    @Column('bigint', { nullable: true })
    ebit?: number;

    @Column('bigint', { nullable: true })
    profitBeforeTax?: number;

    @Column('bigint', { nullable: true })
    netProfit?: number;

    @Column({ nullable: true })
    grossMargin?: string;

    @Column({ nullable: true })
    ebitdaMargin?: string;

    // Calculate fields
    @BeforeInsert()
    @BeforeUpdate()
    calculateFields() {
        // Map revenue, costs and opex values to numbers
        const revenueValues = this.revenues.map(revenue => Number(revenue.value));
        const costsValues = this.costOfSales.map(costOfSales => Number(costOfSales.value));
        const opexValues = this.opex.map(opex => Number(opex.value));
      
        this.totalRevenues = revenueValues.reduce((a, b) => a + b, 0);
        this.totalCosts = costsValues.reduce((a, b) => a + b, 0);      
        const totalOpex = opexValues.reduce((a, b) => a + b, 0);
      
        this.grossProfit = this.totalRevenues - this.totalCosts;
        this.ebitda = this.grossProfit - totalOpex;
        this.ebit = this.ebitda + Number(this.amorDep || 0);
        this.profitBeforeTax = this.ebit + Number(this.interests || 0);
        this.netProfit = this.profitBeforeTax - Number(this.taxes || 0);

        this.grossMargin = `${Math.round((this.grossProfit / this.totalRevenues) * 100)}%`;
        this.ebitdaMargin = `${Math.round((this.ebitda / this.totalRevenues) * 100)}%`;
      }
      
}
