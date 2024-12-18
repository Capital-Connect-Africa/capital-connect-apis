import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('referrals')
export class Referral{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() =>User, user =>user.id, {onDelete: 'CASCADE'})
    @ApiProperty({description: 'Owner of this referral'})
    user: User;

    @Column({ type: "int", default: 0 })
    @ApiProperty({description: 'Number of times users clicked on the referral link'})
    clicks: number;

    @Column({ type: "int", default: 0 })
    @ApiProperty({description: 'Number of times users visited unique pages before signing up'})
    visits: number;
}