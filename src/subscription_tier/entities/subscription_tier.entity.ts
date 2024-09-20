import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { UserSubscription } from "./userSubscription.entity";

@Entity('subscription_tiers')
export class SubscriptionTier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => UserSubscription, (userSubscription) => userSubscription.subscriptionTier, { onDelete: 'CASCADE' })
  subscriptions: UserSubscription[];
}
