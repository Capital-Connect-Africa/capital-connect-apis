import { SubSector } from 'src/subsector/entities/subsector.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { InvestorProfile } from '../../investor-profile/entities/investor-profile.entity';

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
}
