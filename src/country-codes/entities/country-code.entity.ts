import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('country-codes')
export class CountryCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Column({ unique: true })
  name: string;

  @Column()
  code: string; 
}
