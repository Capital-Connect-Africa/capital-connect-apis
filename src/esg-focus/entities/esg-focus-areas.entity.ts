import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('esg-focus-areas')
export class EsgFocusAreas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
