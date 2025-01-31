import { OrganizationType } from 'src/shared/enums/organization.type.enum';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InvestorsRepository } from './investors-repository.entity';

@Entity('investor-repositories-investees')
export class InvestorRespostoryInvestees {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: OrganizationType,
    default: OrganizationType.OUT_BOUND,
  })
  type: OrganizationType;

  @ManyToMany(() => InvestorsRepository, (investor) => investor.investees)
  investors: InvestorsRepository[];
}
