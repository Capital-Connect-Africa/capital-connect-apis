import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvestorProfile } from '../../investor-profile/entities/investor-profile.entity';
import { Company } from '../../company/entities/company.entity';
import { MatchStatus } from '../MatchStatus.enum';

@Entity('match_makings')
export class Matchmaking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InvestorProfile, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'investorProfileId' })
  investorProfile: InvestorProfile;

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column('text', { array: true, nullable: true })
  declineReasons: string[];

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.INTERESTING,
  })
  status: MatchStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
