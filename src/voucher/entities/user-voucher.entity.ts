import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, Column } from 'typeorm';
import { Voucher } from './voucher.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('user_vouchers')
@Unique(['user', 'voucher'])
export class UserVoucher {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.vouchers)
    user: User;

    @ManyToOne(() => Voucher, voucher => voucher.users)
    voucher: Voucher;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    usedAt: Date;
}
