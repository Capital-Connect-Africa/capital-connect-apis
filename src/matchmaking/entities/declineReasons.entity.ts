import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('decline-reasons')
export class DeclineReason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reason: string;
}