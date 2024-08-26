import { File } from 'src/files/entities/file.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NumberOfEmployees, YearsOfOperation } from '../company.type';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  businessSector: string;

  @Column({ nullable: true })
  businessSubsector: string;

  @Column()
  productsAndServices: string;

  @Column()
  registrationStructure: string;

  @Column()
  investmentStructure: string;

  @Column()
  useOfFunds: string;

  @Column()
  esgFocusAreas: string;

  @Column()
  fundsNeeded: number;

  @Column({
    type: 'enum',
    enum: YearsOfOperation,
    default: YearsOfOperation._0,
  })
  yearsOfOperation: YearsOfOperation;

  @Column()
  growthStage: string;

  @Column({
    type: 'enum',
    enum: NumberOfEmployees,
    default: NumberOfEmployees._1_TO_10,
  })
  numberOfEmployees: NumberOfEmployees;

  @Column()
  fullTimeBusiness: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => File)
  @JoinColumn()
  companyLogo: File;
}
