import { UserVoucher } from "./user-voucher.entity";
import { EligibilityRule } from "./eligibility-rule.entity";
import { VoucherType } from "src/shared/enums/voucher.type.enum";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity('vouchers')
export class Voucher {
    @PrimaryGeneratedColumn()
    @ApiProperty({description: 'Unique identifier', type: 'integer'})
    id: number;

    @Column()
    @ApiProperty({type: 'string', description: 'Unique voucher code'})
    code: string;

    @Column({ type: 'enum', enum: VoucherType })
    @ApiProperty({enum: VoucherType, description: 'Essentially the package the voucher can apply to'})
    type: VoucherType;

    @Column()
    @ApiProperty({description: 'Maximum number of times a voucher can be redeemed', type: 'integer'})
    maxUses: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    @ApiProperty({description: 'Portion of the whole price the voucher funds'})
    percentageDiscount: number;

    @Column({type: 'decimal', scale: 2})
    @ApiProperty({description: 'The maximum redeemable discount'})
    maxAmount: number;

    @Column({ type: 'timestamp' })
    @ApiProperty({description: 'Datetime when the validity of a voucher ceases'})
    expiresAt: Date;

    @CreateDateColumn({ type: 'timestamp' })
    @ApiProperty({description: 'Datetime when the voucher was created'})
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    @ApiProperty({description: 'Datetime when the details of the voucher were last modified'})
    updatedAt: Date;

    @ManyToMany(() => EligibilityRule, rule => rule.vouchers)
    @JoinTable({
        name: 'voucher_eligibility_rules',
        joinColumn: { name: 'voucher', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'rule', referencedColumnName: 'id' },
    })
    @ApiProperty({type: [EligibilityRule], description: 'An array of Rules applicable to this voucher',})
    rules: EligibilityRule[];


    @OneToMany(() => UserVoucher, userVoucher => userVoucher.voucher, {onDelete: 'CASCADE'})
    @ApiProperty({type: [UserVoucher], description: 'An array of users who already redeemed the voucher'})
    users: UserVoucher[];
}