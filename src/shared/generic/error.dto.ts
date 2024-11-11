import { ApiProperty } from "@nestjs/swagger"

export class ErrorDto {
    @ApiProperty({description: 'Error message'})
    message: string
    @ApiProperty({description: 'Error type'})
    error: string
    @ApiProperty({description: 'Error code'})
    statusCode: number
}