import { InvestorProfile } from "src/investor-profile/entities/investor-profile.entity";
import { Question } from "src/question/entities/question.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("special_criteria")
export class SpecialCriterion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: false })
    globalVisible: boolean;

    @ManyToMany(() => Question, (questions) => questions.specialcriteria)
    @JoinTable({ name: 'special_criteria_questions' })
    questions: Question[];

    @ManyToOne(() => InvestorProfile, (investorProfile) => investorProfile.specialCriteria, { onDelete: 'CASCADE' })
    investorProfile: InvestorProfile;
}
