import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Sector } from '../../sector/entities/sector.entity';
import { SubSector } from '../../subsector/entities/subsector.entity';
import { JoinTable } from 'typeorm';
import { ContactPerson } from '../../contact-person/entities/contact-person.entity';
import { SpecialCriterion } from 'src/special-criteria/entities/special-criterion.entity';
import { ConnectionRequest } from 'src/matchmaking/entities/connectionRequest.entity';

@Entity('investor_profiles')
export class InvestorProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  headOfficeLocation: string;

  @Column({ nullable: true })
  organizationName: string;

  @Column()
  fundDescription: string;

  @Column()
  emailAddress: string;

  @Column({ nullable: true })
  url: string;

  @Column('bigint')
  availableFunding: number;

  @Column({ nullable: true })
  differentFundingVehicles: string;

  @Column('text', { array: true })
  countriesOfInvestmentFocus: string[];

  @Column('text', { array: true })
  useOfFunds: string[];

  @Column('bigint', { default: 0 })
  minimumFunding: number;

  @Column('bigint', { default: 0 })
  maximumFunding: number;

  @Column('boolean', { default: false })
  noMaximumFunding: boolean;

  @Column('text', { array: true })
  businessGrowthStages: string[];

  @Column()
  investorType: string;

  @Column('text', { array: true })
  investmentStructures: string[];

  @Column('text', { array: true })
  esgFocusAreas: string[];

  @Column('text', { array: true })
  registrationStructures: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  investor: User;

  @ManyToMany(() => Sector, (sector) => sector.investorProfiles)
  @JoinTable()
  sectors: Sector[];

  @ManyToMany(() => SubSector, (subSector) => subSector.investorProfiles)
  @JoinTable()
  subSectors: SubSector[];

  @OneToMany(
    () => ContactPerson,
    (contactPerson) => contactPerson.investorProfile,
  )
  contactPersons: ContactPerson[];

  @OneToMany(
    () => SpecialCriterion,
    (specialCriteria) => specialCriteria.investorProfile,
  )
  specialCriteria: SpecialCriterion[];

  @OneToMany(
    () => ConnectionRequest,
    (connectionRequest) => connectionRequest.investorProfile,
  )
  connectionRequests: ConnectionRequest[];

  @ManyToMany(() => User, (user) => user.investorProfiles)
  users: User[];
}
