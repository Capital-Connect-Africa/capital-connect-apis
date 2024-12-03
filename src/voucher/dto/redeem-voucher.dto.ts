import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty} from "class-validator";
import { VoucherType } from "src/shared/enums/voucher.type.enum";

export class RedeemVoucherDto{

    @IsNotEmpty({message: 'invalid user id'})
    @ApiProperty({ description: 'Id of user redeeming the voucher'})
    userId: number;

    @IsNotEmpty({message: 'invalid purchase'})
    @ApiProperty({ description: 'Type of purchase being made', enum: VoucherType})
    purchase: VoucherType

    @IsNotEmpty({message: 'invalid voucher code'})
    @ApiProperty({ description: 'Code of the voucher being redeemed'})
    voucherCode: string;
}