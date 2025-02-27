import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DealCustomer } from './deal-customer.entity';
import { DealStage } from './deal-stage.entity';
import { DealStatus } from 'src/shared/enums/deal.status.enum';
import { User } from 'src/users/entities/user.entity';
import { DealAttachment } from './deal-attachments.entity';
import { DealStageHistory } from './deal-stage-history.entity';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => DealCustomer, (customer) => customer.deals, {
    nullable: false,
  })
  customer: DealCustomer;

  @Column({ type: 'decimal', precision: 20, scale: 2 }) // for huge value caps
  value: number;

  @Column({ type: 'enum', enum: DealStatus, default: DealStatus.ACTIVE })
  status: DealStatus;

  @ManyToOne(() => DealStage, (stage) => stage.deals)
  stage: DealStage;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @OneToMany(() => DealStageHistory, (history) => history.deal, {
    cascade: true,
  })
  history: DealStageHistory[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
