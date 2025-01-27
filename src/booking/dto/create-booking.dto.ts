import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateBookingDto {
    @IsString()
    @IsOptional()
    calendlyEventId: string;

    @IsString()
    @IsOptional()
    voucherCode?: string

    @IsString()
    @IsOptional()
    notes?: string
    
    @IsDateString()
    @IsOptional()
    meetingStartTime?: Date;

    @IsDateString()
    @IsOptional()
    meetingEndTime?: Date;
}  
