import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Finances } from './finance.entity';

@Entity('revenues')
export class Revenue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string; 

  @Column()
  value: number; 

  @ManyToOne(() => Finances, (finances) => finances.revenues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'financesId' })
  finances: Finances;
}
