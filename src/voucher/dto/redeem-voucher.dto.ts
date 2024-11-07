import { IsNotEmpty} from "class-validator";

export class RedeemVoucherDto{

    @IsNotEmpty({message: 'user id required*'})
    userId: number;

    @IsNotEmpty({message: 'voucher code required*'})
    voucherCode: string;
}