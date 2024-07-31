import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
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
  primaryContact: boolean;

  @ManyToOne(
    () => InvestorProfile,
    (investorProfile) => investorProfile.contactPersons,
  )
  investorProfile: InvestorProfile;
}
