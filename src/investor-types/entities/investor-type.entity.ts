import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('investor-types')
export class InvestorType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
