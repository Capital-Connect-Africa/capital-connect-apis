import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { UserSubscription } from "./userSubscription.entity";
import { SubscriptionTierEnum } from "../../subscription/subscription-tier.enum";

@Entity('subscription_tiers')
export class SubscriptionTier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SubscriptionTierEnum, default: SubscriptionTierEnum.BASIC })
  name: SubscriptionTierEnum;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => UserSubscription, (userSubscription) => userSubscription.subscriptionTier, { onDelete: 'CASCADE' })
  subscriptions: UserSubscription[];
}
