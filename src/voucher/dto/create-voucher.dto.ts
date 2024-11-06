import { VoucherType } from "../../utils/enums/voucher.type.enum";
import { IsInt, IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class CreateVoucherDto{
    @IsNotEmpty({message: 'voucher type required*'})
    type: VoucherType;

    @IsNotEmpty({message: 'voucher use limit required*'})
    @IsInt({message: 'voucher usage limit must be an integer'})
    maxUses: number;

    @IsNotEmpty({message: "add the voucher's validation rules"})
    rules: number[]
    
    @IsNotEmpty({message: 'voucher discount is required*'})
    @IsNumber({maxDecimalPlaces: 2, }, {message: 'discount must be a number'})
    @Min(0, {message: 'dicount percentage cannot be less than 0'})
    @Max(100, {message: 'dicount percentage cannot exceed 100'})
    percentDiscount: number; // as percentage of the package cost (0-100)%
}