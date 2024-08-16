import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Matchmaking } from "./matchmaking.entity";

@Entity('match_decline-reasons')
export class MatchDeclineReason {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'text' })
    reason: string;
  
    @ManyToOne(() => Matchmaking, matchMaking => matchMaking.declineReasons)
    matchMaking: Matchmaking;

  }
  