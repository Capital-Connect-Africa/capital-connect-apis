import { Voucher } from "./voucher.entity";
import { Operators } from "src/utils/enums/operators.enum";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('rules')
export class EligibilityRule {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    userProperty: string;

    @Column({
        type: 'enum',
        enum: Operators
    })
    operator: Operators;

    @Column()
    value: string; // can be range i.e val1 - val2
    @ManyToMany(() => Voucher, voucher => voucher.rules)
    vouchers: Voucher[];
}

// 1. new users -> createdAt
// 2. users refered by -> referralId
// 3. roles
// 4. package

// 5 .150
