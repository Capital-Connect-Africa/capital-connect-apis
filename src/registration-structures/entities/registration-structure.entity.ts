import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('registration-structures')
export class RegistrationStructure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
