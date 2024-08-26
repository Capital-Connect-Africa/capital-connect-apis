import { InvestorProfile } from "src/investor-profile/entities/investor-profile.entity";
import { Question } from "src/question/entities/question.entity";
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity("special_criteria_questions")
export class SpecialCriterionQuestion {
    @PrimaryColumn()
    specialCriteriaId: number;

    @PrimaryColumn()
    questionsId: number;

    @OneToOne(() => Question)
    questions: Question;

    @OneToOne(() => InvestorProfile)
    specialCriteria: InvestorProfile;
}
