import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Deal } from './deal.entity';
import { DealStage } from './deal-stage.entity';

@Entity('deal-stage-history')
export class DealStageHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Deal, (deal) => deal.id, { nullable: false })
  deal: Deal;

  @ManyToOne(() => DealStage, (stage) => stage.stageHistory, {
    nullable: false,
  })
  stage: DealStage;

  @CreateDateColumn({ type: 'timestamp' })
  movedAt: Date;
}
