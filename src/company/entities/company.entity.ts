import { File } from 'src/files/entities/file.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NumberOfEmployees, YearsOfOperation } from '../company.type';
import { ConnectionRequest } from 'src/matchmaking/entities/connectionRequest.entity';
import { Finances } from 'src/finances/entities/finance.entity';
import { BalanceSheet } from 'src/balance-sheet/entities/balance-sheet.entity';
import { CashflowStatement } from 'src/balance-sheet/entities/cash-flows.entity';

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

  @Column('text', { array: true })
  segments: string[];

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

  @Column({default: false})
  isHidden: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => ConnectionRequest, (connectionRequest) => connectionRequest.company, {
    onDelete: 'CASCADE',
  })
  connectionRequests: ConnectionRequest[];

  @OneToMany(() => Finances, (finances) => finances.company,{
    onDelete: 'CASCADE',
  })
  finances: Finances[]; 

  @OneToMany(() => BalanceSheet, (balanceSheet) => balanceSheet.company,{
    onDelete: 'CASCADE',
  })
  balanceSheet: BalanceSheet[]; 

  @OneToMany(() => CashflowStatement, (cashflow) => cashflow.company,{
    onDelete: 'CASCADE',
  })
  cashflowStatements: CashflowStatement[];

  @OneToOne(() => File)
  @JoinColumn()
  companyLogo: File;
}
