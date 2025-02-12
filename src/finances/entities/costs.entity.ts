import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Finances } from './finance.entity';
import { Company } from 'src/company/entities/company.entity';

@Entity('cost_of_sales')
export class CostOfSales {
    @PrimaryGeneratedColumn()
      id: number;
    
      @Column()
      year: number;
    
      @Column()
      description: string; 
    
      @Column()
      value: number; 
    
      @ManyToOne(() => Finances, (finances) => finances.costOfSales, { onDelete: 'CASCADE' })
      @JoinColumn({ name: 'financesId' })
      finances: Finances;
    
      @ManyToOne(() => Company, (company) => company.finances)
      @JoinColumn({ name: 'companyId' })
      company: Company;
}