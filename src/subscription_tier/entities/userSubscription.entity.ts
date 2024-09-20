import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from "../../users/entities/user.entity";
import { SubscriptionTier } from "./subscription_tier.entity";


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
}