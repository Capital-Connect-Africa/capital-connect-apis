import { IsOptional, IsString } from "class-validator";

export class CreateBookingDto {
    @IsString()
    @IsOptional()
    calendlyEventId: string;

    @IsString()
    @IsOptional()
    voucherCode?: string
}  
