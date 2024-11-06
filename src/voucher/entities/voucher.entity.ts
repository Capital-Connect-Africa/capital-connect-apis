import { EligibilityRule } from "./eligibility-rule.entity";
import { VoucherType } from "src/utils/enums/voucher.type.enum";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column({ type: 'timestamp' })
    createdAt: Date;

    @Column({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToMany(() => EligibilityRule, rule => rule.vouchers)
    @JoinTable({
        name: 'voucher_eligibility_rules',
        joinColumn: { name: 'voucher', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'rule', referencedColumnName: 'id' },
    })
    rules: EligibilityRule[];
}
