import { ApiProperty } from "@nestjs/swagger"

export class CreateUserReferralDto{
    @ApiProperty({description: 'Referrer\'s Link', type: 'string'})
    referralId: string
}