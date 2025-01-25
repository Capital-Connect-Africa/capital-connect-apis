import { ApiProperty } from "@nestjs/swagger";
import { Country } from "src/country/entities/country.entity";
import { InvestorType } from "src/investor-types/entities/investor-type.entity";
import { Sector } from "src/sector/entities/sector.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { InvestorsRepositorySupportedOrganization } from "./investors-repository-supported-organizations.entity";
import { Currency } from "src/shared/enums/currency.enum";

@Entity('investors-repository')
export class InvestorsRepository{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() =>Sector)
    @JoinTable()
    sectors: Sector[];

    @Column()
    type: InvestorType;

    @ManyToMany(() =>Country)
    @JoinTable()
    countries: Country[]

    @Column()
    supportedOrganizations: InvestorsRepositorySupportedOrganization

    @Column()
    website?: string;
    @Column()
    minFunding: number;

    @Column()
    maxFunding: number;

    @Column({type: 'enum', default: Currency.USD})
    currency: Currency;
}