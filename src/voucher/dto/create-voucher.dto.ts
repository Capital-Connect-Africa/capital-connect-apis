import { ApiProperty } from "@nestjs/swagger";
import { VoucherType } from "../../shared/enums/voucher.type.enum";
import { IsInt, IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class CreateVoucherDto{
    @IsNotEmpty({message: 'voucher type required*'})
    @ApiProperty({enum: VoucherType, description: 'Essentially the package the voucher can apply to'})
    type: VoucherType;

    @IsNotEmpty({message: 'voucher use limit required*'})
    @IsInt({message: 'voucher usage limit must be an integer'})
    @ApiProperty({description: 'Maximum number of times a voucher can be redeemed', type: 'integer'})
    maxUses: number;

    @IsNotEmpty({message: "voucher use limit required*"})
    @IsNumber({maxDecimalPlaces: 2, }, {message: 'voucher usage limit must be an integer'})
    @ApiProperty({description: 'The maximum redeemable discount'})
    maxAmount: number;

    @IsNotEmpty({message: "expiry date is required*"})
    @ApiProperty({description: 'Datetime when the validity of a voucher ceases'})
    expiresAt: Date;

    @IsNotEmpty({message: "add the voucher's validation rules*"})
    @ApiProperty({type: 'integer', isArray: true, description: 'Ids of rules to be applied on the voucher'})
    rules: number[]
    


    @IsNotEmpty({message: 'voucher discount is required*'})
    @IsNumber({maxDecimalPlaces: 2, }, {message: 'discount must be a number'})
    @Min(0, {message: 'dicount percentage cannot be less than 0'})
    @Max(100, {message: 'dicount percentage cannot exceed 100'})
    @ApiProperty({description: 'Portion of the whole price the voucher funds'})
    percentageDiscount: number; // as percentage of the package cost (0-100)%

}