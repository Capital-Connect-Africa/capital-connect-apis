import { ApiProperty } from "@nestjs/swagger";

export class UpdateReferralMetricsDto{
    
    @ApiProperty({description: 'Update clicks count?', type: 'boolean'})
    clicks?: boolean;

    @ApiProperty({description: 'Update Visits count?', type: 'boolean'})
    visits?: boolean;
}