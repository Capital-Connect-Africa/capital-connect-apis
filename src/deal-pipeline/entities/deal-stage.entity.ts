import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Deal } from './deal.entity';
import { DealStageHistory } from './deal-stage-history.entity';

@Entity('deal-stages')
export class DealStage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 20, scale: 2 }) // for huge value caps
  value: number;

  @Column({ type: 'int', width: 3 }) // Progress as percentage (0-100)
  progress: number;

  @OneToMany(() => Deal, (deal) => deal.stage)
  deals: Deal[];

  @OneToMany(() => DealStageHistory, (history) => history.stage)
  stageHistory: DealStageHistory[];
}
