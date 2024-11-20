import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FinanceSubmission} from "./finance_submission.entity";

@Entity('finance_questions')
export class FinancialQuestions {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    question: string;
  
    @Column({ type: 'text' })
    description: string;

    @OneToMany(() => FinanceSubmission, (financialSubmissions) => financialSubmissions.question)
    financialSubmissions: FinanceSubmission[];
}
