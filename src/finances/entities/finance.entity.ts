import { 
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn 
} from "typeorm";
import { FinanceStatus } from "../finance.enum";
import { Company } from "src/company/entities/company.entity";
import { File } from "src/files/entities/file.entity";

@Entity('finances')
export class Finances {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'text' })
    description: string;

    @Column()
    year: number; 
  
    @Column()
    income: number; 

    @Column()
    expenses: number;

    @Column()
    profits:number;
  
    @CreateDateColumn()
    createdAt: Date; 

    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column({ type: 'enum', enum: FinanceStatus, default: 'pending' })
    status: FinanceStatus; 
  
    @Column('text', { nullable: true })
    notes: string;

    @OneToOne(() => File)
    @JoinColumn()
    attachments: File;

    @ManyToOne(() => Company, (company) => company.finances)
    @JoinColumn({ name: 'companyId' })
    company: Company; 
}
