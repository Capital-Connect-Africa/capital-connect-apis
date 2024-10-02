import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SubscriptionTier } from './subscription_tier.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity('user_subscriptions')
export class UserSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;

  @ManyToOne(() => SubscriptionTier, (tier) => tier.subscriptions)
  subscriptionTier: SubscriptionTier;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  subscriptionDate: Date;

  @Column({ type: 'timestamp' })
  expiryDate: Date;

  @Column({ default: false })
  isActive: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];
}
