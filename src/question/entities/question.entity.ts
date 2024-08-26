import { Answer } from 'src/answer/entities/answer.entity';
import { SubSection } from 'src/subsection/entities/subsection.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { QuestionType } from '../question.type';
import { Submission } from 'src/submission/entities/submission.entity';
import { SpecialCriterion } from 'src/special-criteria/entities/special-criterion.entity';

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  tooltip: string;

  @ManyToOne(() => SubSection, (subSection) => subSection.questions, {
    onDelete: "CASCADE",
  })
  subSection: SubSection;

  @OneToMany(() => Answer, (answer) => answer.question, {
    onDelete: "CASCADE",
  })
  answers: Answer[];

  @OneToMany(() => Submission, submission => submission.question)
  submissions: Submission[];

  @ManyToMany( () => SpecialCriterion, (specialcriteria) => specialcriteria.questions)
  specialcriteria: SpecialCriterion[];
}
