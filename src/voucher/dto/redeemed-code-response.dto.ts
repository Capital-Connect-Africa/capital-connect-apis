import { ApiProperty } from "@nestjs/swagger"

export class RedeemedVoucherDto{
    @ApiProperty({description: 'Redeemed voucher code'})
    code: number;

    @ApiProperty({description: 'Maximum amount applicable'})
    maxAmount: number;

    @ApiProperty({description: 'Discount applied'})
    discount: number;
}