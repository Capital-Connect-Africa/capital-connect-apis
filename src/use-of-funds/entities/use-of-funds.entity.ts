import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('use-of-funds')
export class UseOfFunds {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
