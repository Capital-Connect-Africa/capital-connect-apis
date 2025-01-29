import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { DealStage } from './deal-stage.entity';

@Entity('deal-pipelines')
export class DealPipeline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Default Pipeline' })
  name: string;

  @OneToMany(() => DealStage, (stage) => stage.pipeline, { cascade: true })
  stages: DealStage[];

  @Column({ type: 'integer', default: 7 })
  maxNumberOfStages?: string;

  @ManyToOne(() => User, (user) => user.pipelines, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  owner: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  UpdatedAt: Date;
}
