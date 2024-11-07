import { IsEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateVoucherDto } from "./create-voucher.dto";

export class UpdateVoucherDto extends PartialType(CreateVoucherDto){
    @IsEmpty()
    users: number[]
}