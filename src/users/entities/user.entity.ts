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
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Submission } from 'src/submission/entities/submission.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { MobileNumber } from 'src/mobile/entities/mobile-number.entity';
import { InvestorProfile } from '../../investor-profile/entities/investor-profile.entity';
import { UserSubscription } from '../../subscription_tier/entities/userSubscription.entity';
import { UserVoucher } from 'src/voucher/entities/user-voucher.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: Role.User.toString() })
  roles: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerificationExpires: Date;

  @Column({ default: false })
  hasAcceptedTerms: boolean;

  @Column({ type: 'timestamp', nullable: true })
  termsAcceptedAt: Date;

  @OneToMany(() => Submission, (submission) => submission.user)
  submissions: Submission[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => MobileNumber, (mobile) => mobile.user)
  mobileNumbers: MobileNumber[];

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

  @OneToMany(
    () => UserVoucher,
    (voucher) => voucher.user,
  )
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
}
