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
