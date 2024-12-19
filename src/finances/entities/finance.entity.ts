import { 
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

@Entity('finances')
export class Finances {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    year: number; 

    @Column('bigint', { default: 0 })
    costOfSales: number;

    @Column('bigint', { default: 0 })
    ebitda: number;

    @Column('bigint', { default: 0 })
    ebit: number;

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

    @OneToOne(() => File)
    @JoinColumn()
    attachments: File;

    @ManyToOne(() => Company, (company) => company.finances)
    @JoinColumn({ name: 'companyId' })
    company: Company;
    
    @ManyToOne(() => User, (user) => user.finances)
    @JoinColumn({ name: 'userId' })
    user: User; 
}
