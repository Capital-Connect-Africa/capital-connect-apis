import { SubSector } from 'src/subsector/entities/subsector.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { InvestorProfile } from '../../investor-profile/entities/investor-profile.entity';
import { InvestorsRepository } from 'src/investors-repository/entities/investors-repository.entity';

@Entity('sectors')
export class Sector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => SubSector, (subSector) => subSector.sector, {
    onDelete: 'CASCADE',
  })
  subSectors: SubSector[];

  @ManyToMany(
    () => InvestorProfile,
    (investorProfile) => investorProfile.sectors,
  )
  investorProfiles: InvestorProfile[];

  @ManyToMany(() => InvestorsRepository, (investor) => investor.sectors)
  investors: InvestorsRepository[];
}
