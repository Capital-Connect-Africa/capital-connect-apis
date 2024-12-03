import { Booking } from 'src/booking/entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSubscription } from '../../subscription_tier/entities/userSubscription.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  @ApiProperty({description: 'Payment\'s unique id'})
  id: number;

  @Column()
  @ApiProperty({description: 'Currency denomination', default: 'KES'})
  currency: string;

  @Column()
  @ApiProperty({description: 'Amount paid'})
  amount: number;

  @Column({default: 0})
  @ApiProperty({description: 'Amount deducted from the original amount'})
  discount: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({description: 'Reason for this payment'})
  description: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({description: 'Payment status', default: 'intiated'})
  status: string;

  @Column({ default: 0 })
  @ApiProperty({description: 'Pesapal unique identifier to track purchase made by the payment'})
  orderTrackingId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({description: 'Date when payment was made', type: Date})
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty({description: 'Date when payment details were modified', type: Date})
  updatedAt: Date;

  @ManyToOne(
    () => UserSubscription,
    (userSubscription) => userSubscription.payments,
  )
  @ApiProperty({description: 'Subscription the payment was made to acquire', type: [UserSubscription], required: false})
  userSubscription: UserSubscription;

  @ManyToOne(() => Booking, (booking) => booking.payments)
  @ApiProperty({description: 'Booking the payment was made to schedule', type: [Booking], required: false})
  booking: Booking;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  @ApiProperty({description: 'User who made the payment', type: [User]})
  user: User;
}
