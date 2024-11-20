import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FinancialQuestions } from "./finance.entity";
import { FinanceStatus } from "../finance.enum";
import { File } from "src/files/entities/file.entity";

@Entity('finance_answers')
export class FinanceSubmission {
    @PrimaryGeneratedColumn()
    id: number; 
  
    @Column()
    year: number; 
  
    @Column()
    amount: number; 
  
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

    @ManyToOne(() => FinancialQuestions, (question) => question.financialSubmissions)
    @JoinColumn({ name: 'questionId' })
    question: FinancialQuestions;

    @ManyToOne(() => User, (user) => user.financeSubmissions)
    @JoinColumn({ name: 'userId' })
    userId: User; 
}