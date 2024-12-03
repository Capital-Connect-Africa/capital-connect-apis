import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { InvestorProfile } from '../../investor-profile/entities/investor-profile.entity';

@Entity('contact_persons')
export class ContactPerson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  designation: string;

  @Column()
  emailAddress: string;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  hasAccess: boolean;

  @Column({ default: false })
  primaryContact: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => InvestorProfile,
    (investorProfile) => investorProfile.contactPersons, {
      onDelete: 'CASCADE',
    },
  )
  investorProfile: InvestorProfile;
}
