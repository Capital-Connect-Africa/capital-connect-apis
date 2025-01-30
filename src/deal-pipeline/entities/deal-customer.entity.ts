import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Deal } from './deal.entity';

@Entity('deal-customers')
export class DealCustomer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @ManyToOne(() => User, (user) => user.customers, { nullable: true })
  user?: User;

  @OneToMany(() => Deal, (deal) => deal.customer)
  deals: Deal[];
}
