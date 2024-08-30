import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ScoringType } from '../scoring.type';

@Entity('scorings')
export class Scoring {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: string;

  @Column()
  comment: string;

  @Column({ type: 'text', nullable: true })
  implication: string;

  @Column({ type: 'text', nullable: true })
  action: string;

  @Column({ type: 'text', nullable: true })
  recommendation: string;

  @Column({
    type: 'enum',
    enum: ScoringType,
  })
  type: ScoringType;
}
