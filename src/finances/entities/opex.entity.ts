import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Finances } from './finance.entity';

@Entity('opex')
export class Opex {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string; 

  @Column()
  value: number; 

  @ManyToOne(() => Finances, (finances) => finances.opex, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'financesId' })
  finances: Finances;
}
