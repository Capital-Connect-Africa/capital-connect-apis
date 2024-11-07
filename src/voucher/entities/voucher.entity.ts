import { UserVoucher } from "./user-voucher.entity";
import { EligibilityRule } from "./eligibility-rule.entity";
import { VoucherType } from "src/shared/enums/voucher.type.enum";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('vouchers')
export class Voucher {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column({ type: 'enum', enum: VoucherType })
    type: VoucherType;

    @Column()
    maxUses: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    percentageDiscount: number;

    @Column({type: 'decimal', scale: 2})
    maxAmount: number;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToMany(() => EligibilityRule, rule => rule.vouchers)
    @JoinTable({
        name: 'voucher_eligibility_rules',
        joinColumn: { name: 'voucher', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'rule', referencedColumnName: 'id' },
    })
    rules: EligibilityRule[];


    @OneToMany(() => UserVoucher, userVoucher => userVoucher.voucher)
    users: UserVoucher[];
}