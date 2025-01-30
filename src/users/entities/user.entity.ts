import { Role } from 'src/auth/role.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Submission } from 'src/submission/entities/submission.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { MobileNumber } from 'src/mobile/entities/mobile-number.entity';
import { InvestorProfile } from '../../investor-profile/entities/investor-profile.entity';
import { UserSubscription } from '../../subscription_tier/entities/userSubscription.entity';
import { Finances } from 'src/finances/entities/finance.entity';
import { UserVoucher } from 'src/voucher/entities/user-voucher.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Referral } from 'src/user-referral/entities/referral.entity';
import { DealCustomer } from 'src/deal-pipeline/entities/deal-customer.entity';
import { DealPipeline } from 'src/deal-pipeline/entities/deal-pipeline.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'User unique identifier' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: 'A unique user email id' })
  username: string;

  @Column()
  @ApiProperty({ description: 'An encripted user password' })
  password: string;

  @Column({ nullable: true })
  @ApiProperty({ description: "User's initial name", required: false })
  firstName: string;

  @Column({ nullable: true })
  @ApiProperty({ description: "User's last name", required: false })
  lastName: string;

  @Column({ default: Role.User.toString() })
  @ApiProperty({ description: 'User role', enum: Role })
  roles: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'A password reset token', required: false })
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({
    description:
      'A date time when the validity of the password reset token ceases',
    required: false,
  })
  resetPasswordExpires: Date;

  @Column({ default: false })
  @ApiProperty({
    description: 'Whether user email was validated',
    required: false,
    type: Boolean,
  })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerificationExpires: Date;

  @Column({ default: false })
  hasAcceptedTerms: boolean;

  @Column({ type: 'timestamp', nullable: true })
  termsAcceptedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Submission, (submission) => submission.user)
  submissions: Submission[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => MobileNumber, (mobile) => mobile.user)
  mobileNumbers: MobileNumber[];

  @OneToMany(() => Booking, (booking) => booking.advisor)
  @OneToMany(() => Booking, (booking) => booking.advisor)
  advisedBookings: Booking[];

  @OneToOne(
    () => InvestorProfile,
    (investorProfile) => investorProfile.investor,
  )
  investorProfile: InvestorProfile;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(
    () => UserSubscription,
    (userSubscription) => userSubscription.user,
    { onDelete: 'CASCADE' },
  )
  subscriptions: UserSubscription[];

  @OneToMany(() => Finances, (finances) => finances.user, {
    onDelete: 'CASCADE',
  })
  finances: Finances[];
  @OneToMany(() => UserVoucher, (voucher) => voucher.user)
  vouchers: UserVoucher[];

  @ManyToMany(() => InvestorProfile, (profile) => profile.users)
  @JoinTable({
    name: 'contact_person_profiles', // Name of the join table
    joinColumn: { name: 'contactPersonId', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'investorProfileId',
      referencedColumnName: 'id',
    },
  })
  investorProfiles: InvestorProfile[];

  // Referrals
  @Column({ nullable: true, unique: true })
  @ApiProperty({ description: 'User referral identifier', required: false })
  referralCode: string;

  @ManyToOne(() => User, (user) => user.referredUsers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  referrer: User;

  @OneToMany(() => User, (user) => user.referrer)
  referredUsers: User[];

  @OneToOne(() => Referral, (referral) => referral.user)
  referral: Referral;

  // deal pipeline
  @OneToMany(() => DealPipeline, (pipeline) => pipeline.owner, {
    cascade: true,
  })
  pipelines: DealPipeline[];

  @OneToMany(() => DealCustomer, (customer) => customer.user, { cascade: true })
  customers: DealCustomer[];
}
