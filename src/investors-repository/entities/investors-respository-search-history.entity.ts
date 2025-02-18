import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('investors-respository-search-history')
export class InvestorsRepositorySearchHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  sector: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  subSector: string;

  @Column({
    type: 'decimal',
    precision: 20,
    scale: 2,
    nullable: true,
    default: 0,
  })
  targetAmount: number;

  @Column()
  useOfFunds: string;

  @Column({ default: 0 })
  matches: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
