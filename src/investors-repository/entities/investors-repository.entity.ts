import { InvestorType } from 'src/investor-types/entities/investor-type.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvestorRespostoryInvestees } from './investor-repository-investees.entity';
import { Currency } from 'src/shared/enums/currency.enum';
import { SubSector } from 'src/subsector/entities/subsector.entity';

@Entity('investors-repository')
export class InvestorsRepository {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Sector, (sector) => sector.investors)
  @JoinTable()
  sectors: Sector[];

  @ManyToOne(() => InvestorType, (type) => type.investors)
  type: InvestorType;

  @Column('text', { array: true })
  countries: string[];

  @Column('text', { array: true })
  businessGrowthStages: string[];

  @ManyToMany(() => InvestorRespostoryInvestees, (org) => org.investors)
  investees: InvestorRespostoryInvestees[];

  @ManyToMany(() => SubSector, (subSector) => subSector)
  @JoinTable()
  subSectors: SubSector[];

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  minFunding: number;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  maxFunding: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.USD })
  currency: Currency;

  @Column({ nullable: true })
  fundingVehicle: string;

  @Column('text', { array: true })
  esgFocusAreas: string[];

  @Column('text', { nullable: true })
  description?: string;
}
