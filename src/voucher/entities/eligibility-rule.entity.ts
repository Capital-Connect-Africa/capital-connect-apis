import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Voucher } from "./voucher.entity";

@Entity('rules')
export class EligibilityRule{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userProperty: string;

    @Column()
    operator: string; // >, <, =, contains etc

    @Column()
    value: string;

    @ManyToMany(() =>Voucher, voucher => voucher.rules)
    vouchers: Voucher[]
}

// 1. new users -> createdAt
// 2. users refered by -> referralId
// 3. roles
// 4. package
