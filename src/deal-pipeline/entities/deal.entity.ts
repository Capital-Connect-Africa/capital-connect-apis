import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DealCustomer } from './deal-customer.entity';
import { DealStage } from './deal-stage.entity';
import { DealStatus } from 'src/shared/enums/deal.status.enum';
import { User } from 'src/users/entities/user.entity';
import { DealAttachment } from './deal-attachments.entity';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.deals, { nullable: false })
  user: User;

  @Column()
  name: string;

  @ManyToOne(() => DealCustomer, (customer) => customer.deals, {
    cascade: true,
    nullable: false,
  })
  customer: DealCustomer;

  @ManyToOne(() => DealStage, (stage) => stage.deals, { nullable: false })
  stage: DealStage;

  @Column({ type: 'enum', enum: DealStatus, default: DealStatus.ACTIVE })
  status: DealStatus;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
