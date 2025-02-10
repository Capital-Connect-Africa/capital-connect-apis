import { ApiProperty } from '@nestjs/swagger';
import { Voucher } from './voucher.entity';
import { Operators } from 'src/shared/enums/operators.enum';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserProperties } from 'src/shared/enums/user.properies.enum';

@Entity('rules')
export class EligibilityRule {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserProperties,
  })
  @ApiProperty({
    description: 'Targeted user table column name',
    enum: UserProperties,
  })
  userProperty: UserProperties;

  @Column({
    type: 'enum',
    enum: Operators,
  })
  @ApiProperty({ description: 'Logical operators applied', enum: Operators })
  operator: Operators;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @ApiProperty({
    description:
      'A message displayed to the user when validation against a property fails. Essentially custom errors',
    type: 'string',
  })
  description: string;

  @Column()
  @ApiProperty({
    description: 'The value being validated against',
    type: 'string',
  })
  value: string; // can be range i.e val1 - val2

  @ManyToMany(() => Voucher, (voucher) => voucher.rules, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    description: 'The voucher to which the rule is applied',
    type: [Voucher],
  })
  vouchers: Voucher[];
}

// 1. new users -> createdAt
// 2. users refered by -> referralId
// 3. roles
// 4. package

// 5 max amount: price
