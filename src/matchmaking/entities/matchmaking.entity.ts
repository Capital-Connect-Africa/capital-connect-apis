import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InvestorProfile } from '../../investor-profile/entities/investor-profile.entity';
import { Company } from '../../company/entities/company.entity';
import { MatchDeclineReason } from './match-decline.entity';

@Entity('match_makings')
export class Matchmaking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InvestorProfile, { eager: true,
    onDelete: 'CASCADE',
  },)
  @JoinColumn({ name: 'investorProfileId' })
  investorProfile: InvestorProfile;

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @OneToMany(() => MatchDeclineReason, declineReason => declineReason.matchMaking, {
    cascade: true,
  })
  declineReasons: MatchDeclineReason[];

  @Column({
    type: 'enum',
    enum: ['interesting', 'declined', 'connected'],
    default: 'interesting',
  })
  status: 'interesting' | 'declined' | 'connected';  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
