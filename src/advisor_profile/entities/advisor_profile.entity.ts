import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { feeStructure, Role, servicesOffered } from "../advisor.type";
import { User } from "src/users/entities/user.entity";

@Entity('advisor_profile')
export class AdvisorProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({type: 'enum', enum: Role, array: true})
    roles: Role[];

    @Column()
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    website: string;

    @Column("text")
    professionalSummary: string;

    @Column("text")
    personalPitch: string;

    @Column('text', { array: true })
    capitalRaisingStrategies: string[];

    @Column('text', { array: true })
    industryFocus: string[];

    @Column('text', { array: true })
    countryFocus: string[];

    @Column({type: 'enum', enum: servicesOffered, array: true})
    servicesOffered: servicesOffered[];

    @Column("text", { nullable: true })
    pastProjects: string;

    @Column('bigint', { nullable: true })
    totalCapitalRaised: number;

    @Column("text", { nullable: true })
    caseStudies: string;

    @Column("int", { nullable: true })
    totalTeamMembers: number;

    @Column("int", { nullable: true })
    totalYearsExperience: number;

    @Column("text", { nullable: true })
    keyTeamMembers: string;

    @Column({type: 'enum', enum: feeStructure, array: true})
    feeStructure: feeStructure[];

    @ManyToOne(() => User, (user) => user.advisorProfile)
    user: User;
}
