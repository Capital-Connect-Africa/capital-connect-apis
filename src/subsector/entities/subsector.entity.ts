import { Sector } from 'src/sector/entities/sector.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { InvestorProfile } from '../../investor-profile/entities/investor-profile.entity';
import { Segment } from 'src/segment/entities/segment.entity';

@Entity('subsectors')
export class SubSector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Sector, (sector) => sector.subSectors, {
    onDelete: 'CASCADE',
  })
  sector: Sector;

  @OneToMany(() => Segment, (segments) => segments.subSector, {
    onDelete: 'CASCADE',
  })
  segments: Segment[];

  @ManyToMany(
    () => InvestorProfile,
    (investorProfile) => investorProfile.subSectors,
  )
  investorProfiles: InvestorProfile[];
}
