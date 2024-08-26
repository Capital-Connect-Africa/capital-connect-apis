import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stages')
export class Stage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
