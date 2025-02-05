import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Column,
} from 'typeorm';
import { Voucher } from './voucher.entity';
import { User } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_vouchers')
@Unique(['user', 'voucher'])
export class UserVoucher {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier' })
  id: number;

  @ManyToOne(() => User, (user) => user.vouchers)
  @ApiProperty({
    description: 'User who has redeemed the voucher',
    type: [User],
  })
  user: User;

  @ManyToOne(() => Voucher, (voucher) => voucher.users, { onDelete: 'CASCADE' })
  @ApiProperty({
    description: 'Voucher that has been redeemed by the user',
    type: [Voucher],
  })
  voucher: Voucher;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'Time when the code was redeemed' })
  usedAt: Date;
}
