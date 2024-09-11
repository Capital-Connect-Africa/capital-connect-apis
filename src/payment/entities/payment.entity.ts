import { Booking } from "src/booking/entities/booking.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string;

  @Column()
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  status: string;

  @Column({ default: 0 })
  orderTrackingId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Booking, booking => booking.payments)
  booking: Booking;

  @ManyToOne(() => User, user => user.payments, { onDelete: 'CASCADE' })
  user: User;
}
