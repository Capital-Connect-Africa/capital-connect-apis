import { OrganizationType } from "src/shared/enums/organization.type.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('investors-repository-supported-organization')
export class InvestorsRepositorySupportedOrganization{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: 'enum', default: OrganizationType.OUT_BOUND})
    type: OrganizationType
}