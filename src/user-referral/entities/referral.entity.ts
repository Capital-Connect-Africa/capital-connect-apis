import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('referrals')
export class Referral{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() =>User, user =>user.id, {onDelete: 'CASCADE'})
    @ApiProperty({description: 'Users referred by this user'})
    user: User;

    @Column({ type: "int", default: 0 })
    @ApiProperty({description: 'Users referred by this user'})
    clicks: number;

    @Column({ type: "int", default: 0 })
    @ApiProperty({description: 'Users referred by this user'})
    visits: number;
}