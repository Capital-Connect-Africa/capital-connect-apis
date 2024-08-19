import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('investment-structures')
export class InvestmentStructure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
