import { IsNotEmpty} from "class-validator";
import { VoucherType } from "src/shared/enums/voucher.type.enum";

export class RedeemVoucherDto{

    @IsNotEmpty({message: 'invalid user id'})
    userId: number;

    @IsNotEmpty({message: 'invalid purchase'})
    purchase: VoucherType

    @IsNotEmpty({message: 'invalid voucher code'})
    voucherCode: string;
}