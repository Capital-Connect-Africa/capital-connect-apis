import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Deal } from './deal.entity';
import { DealPipeline } from './deal-pipeline.entity';

@Entity('deal-stages')
export class DealStage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int', width: 3 }) // Progress as percentage (0-100)
  progress: number;

  @OneToMany(() => Deal, (deal) => deal.stage)
  deals: Deal[];

  @ManyToOne(() => DealPipeline, (pipeline) => pipeline.stages)
  pipeline: DealPipeline;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
