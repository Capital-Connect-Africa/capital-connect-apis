import { Answer } from 'src/answer/entities/answer.entity';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';


@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Question)
  question: Question;

  @ManyToOne(() => Answer)
  answer: Answer;

  @Column({nullable: true})
  text: string;
}
