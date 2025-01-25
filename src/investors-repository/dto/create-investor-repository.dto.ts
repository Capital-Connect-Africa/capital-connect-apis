import { ApiProperty } from "@nestjs/swagger";

export class CreateInvestorRepositoryDto{
    
    @ApiProperty({description: 'Update clicks count?', type: 'boolean'})
    name: string;

    @ApiProperty({description: 'Update Visits count?', type: 'boolean'})
    sectors:string[];
    type: string;
    country: string;
    organizations?: string[];
    website?: string;
    minFunding: number;
    maxFunding: number;
    currency: string
}