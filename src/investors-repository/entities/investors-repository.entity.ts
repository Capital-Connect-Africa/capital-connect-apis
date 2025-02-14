import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Currency } from 'src/shared/enums/currency.enum';

@Entity('investors-repository')
export class InvestorsRepository {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  type: string;

  @Column('text', { array: true })
  countries: string[];

  @Column('text', { array: true })
  sectors: string[];

  @Column('text', { array: true })
  businessGrowthStages: string[];

  @Column('text', { array: true })
  investees: string[];

  @Column('text', { array: true })
  subSectors: string[];

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactName: string;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  minFunding: number;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  maxFunding: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.USD })
  currency: Currency;

  @Column({ nullable: true })
  fundingVehicle: string;

  @Column('text', { array: true })
  useOfFunds: string[];

  @Column('text', { array: true })
  investmentStructures: string[];

  @Column('text', { array: true })
  esgFocusAreas: string[];

  @Column('text', { nullable: true })
  description: string;
}
