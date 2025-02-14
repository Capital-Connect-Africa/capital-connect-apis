import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InvestorsRepository } from 'src/investors-repository/entities/investors-repository.entity';

@Entity('investor-types')
export class InvestorType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => InvestorsRepository, (investor) => investor.type)
  investors: InvestorsRepository[];
}
