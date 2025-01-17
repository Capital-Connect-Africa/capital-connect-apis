import { Payment } from 'src/payment/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  calendlyEventId: string;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true }) 
  meetingStartTime: Date;

  @Column({ type: 'timestamptz', nullable: true }) 
  meetingEndTime: Date;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({name: 'advisor'})
  advisor: User;
}
