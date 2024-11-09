import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DeclineRole } from "../MatchStatus.enum";

@Entity('decline-reasons')
export class DeclineReason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'enum', enum: DeclineRole, nullable: true })
  declineRole: DeclineRole;

  @Column()
  reason: string;
}