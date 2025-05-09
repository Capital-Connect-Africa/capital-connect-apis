import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Finances } from './finance.entity';
import { Company } from 'src/company/entities/company.entity';

@Entity('revenues')
export class Revenue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: () => `date_part('year', now())::INTEGER` })
  year: number;

  @Column()
  description: string; 

  @Column()
  value: number; 

  @ManyToOne(() => Finances, (finances) => finances.revenues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'financesId' })
  finances: Finances;

  @ManyToOne(() => Company, (company) => company.finances)
  @JoinColumn({ name: 'companyId' })
  company: Company;
}
