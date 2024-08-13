import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Column({ unique: true })
  name: string;

  @Column()
  @Column({ unique: true })
  code: string; // ISO 3166-1 alpha-2 code

  @Column()
  phone: string;
}
