import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mobile-numbers')
export class MobileNumber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNo: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  otp: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.mobileNumbers, { onDelete: 'CASCADE' })
  user: User;
}
