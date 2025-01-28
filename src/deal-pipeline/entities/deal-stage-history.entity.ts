import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { Deal } from './deal.entity';
import { Stage } from 'src/stage/entities/stage.entity';

@Entity('deal-stage-history')
export class DealStageHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Deal, (deal) => deal.history, { onDelete: 'CASCADE' })
  deal: Deal;

  @ManyToOne(() => Stage, { nullable: true, onDelete: 'SET NULL' })
  fromStage: Stage;

  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0 }) // keeps track of changes in deal value through stages
  valueShift: number;

  @ManyToOne(() => Stage, { nullable: false, onDelete: 'CASCADE' })
  toStage: Stage;

  @CreateDateColumn()
  movedAt: Date;
}
