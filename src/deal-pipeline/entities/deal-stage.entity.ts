import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Deal } from './deal.entity';
import { DealStageHistory } from './deal-stage-history.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('deal-stages')
export class DealStage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() =>User, user =>user.deals)
  user:User

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int', width: 3 }) // Progress as percentage (0-100)
  progress: number;

  @ManyToOne(() => Deal, (deal) => deal.stages)
  deal: Deal[];

  @OneToMany(() => DealStageHistory, (history) => history.deal)
  stageHistory: DealStageHistory[];
}
