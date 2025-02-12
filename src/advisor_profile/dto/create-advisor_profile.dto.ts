import { IsArray, IsEnum, IsNumber, IsString} from "class-validator";
import { feeStructure, Role, servicesOffered } from "../advisor.type";

export class CreateAdvisorProfileDto {
    @IsString()
    fullName: string;

    @IsEnum(Role, { each: true })
    roles: Role[];

    @IsString()
    email: string;

    @IsString()
    phone: string;

    @IsString()
    website: string;

    @IsString()
    professionalSummary: string;

    @IsString()
    personalPitch: string;

    @IsArray()
    capitalRaisingStrategies: string[];

    @IsArray()
    industryFocus: string[];

    @IsArray()
    countryFocus: string[];

    @IsEnum(servicesOffered, { each: true })
    servicesOffered: servicesOffered[];

    @IsString()
    pastProjects: string;

    @IsNumber()
    totalCapitalRaised: number;

    @IsString()
    caseStudies: string;

    @IsNumber()
    totalTeamMembers: number;

    @IsNumber()
    totalYearsExperience: number;

    @IsString()
    keyTeamMembers: string;

    @IsEnum(feeStructure, { each: true })
    feeStructure: feeStructure[];

    @IsNumber()
    userId: number;
}
