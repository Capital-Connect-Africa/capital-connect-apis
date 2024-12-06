import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('referrals')
export class ReferralEntity{
    @Column()
    @PrimaryGeneratedColumn()
    id: number

    @Column('integer', {default: 0})
    clicks: number;

    @Column('integer', {default: 0})
    visits: number
}