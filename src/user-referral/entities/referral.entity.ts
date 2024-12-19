import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('referrals')
export class Referral{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() =>User, user =>user.id, {onDelete: 'CASCADE'})
    @JoinColumn()
    @ApiProperty({description: 'Owner of this referral', type: User})
    user: User;

    @Column({ type: "int", default: 0 })
    @ApiProperty({description: 'Number of times users clicked on the referral link', type: 'number'})
    clicks: number;

    @Column({ type: "int", default: 0 })
    @ApiProperty({description: 'Number of times users visited unique pages before signing up', type: 'number'})
    visits: number;
}