import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { Deal } from './deal.entity';
import { DealStage } from './deal-stage.entity';

@Entity('deal-stage-history')
export class DealStageHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Deal, (deal) => deal.history, { onDelete: 'CASCADE' })
  deal: Deal;

  @ManyToOne(() => DealStage, { nullable: true, onDelete: 'SET NULL' })
  fromStage: DealStage;

  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0.0 }) // keeps track of changes in deal value through stages
  valueShift: number;

  @ManyToOne(() => DealStage, { nullable: false, onDelete: 'CASCADE' })
  toStage: DealStage;

  @CreateDateColumn()
  movedAt: Date;
}
