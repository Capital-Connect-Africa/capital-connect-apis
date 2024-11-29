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
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_subscriptions')
export class UserSubscription {
  @PrimaryGeneratedColumn()
  @ApiProperty({description: 'Unique user subscription identifier'})
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @ApiProperty({description: 'All users subscribing to this package', type: [User]})
  user: User;

  @ManyToOne(() => SubscriptionTier, (tier) => tier.subscriptions)
  @ApiProperty({description: 'A subscription tier selected by the user', type: [SubscriptionTier]})
  subscriptionTier: SubscriptionTier;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({description: 'The time when user subscribed to the tier'})
  subscriptionDate: Date;

  @Column({ type: 'timestamp' })
  @ApiProperty({description: 'Time when the current user subscription expired',})
  expiryDate: Date;

  @Column({ default: false })
  @ApiProperty({description: 'Whether the current subscription is active', type: Boolean})
  isActive: boolean;

  @UpdateDateColumn()
  @ApiProperty({description: 'Date when user subscription was last modified'})
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.booking)
  @ApiProperty({description: 'Payment(s) a user made to aquire this package', type: Payment, isArray: true})
  payments: Payment[];
}
