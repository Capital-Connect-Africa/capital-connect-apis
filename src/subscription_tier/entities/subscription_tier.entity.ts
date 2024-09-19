import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity('subscription_tiers')
export class SubscriptionTier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.subscriptionTier)
  users: User[];
}
