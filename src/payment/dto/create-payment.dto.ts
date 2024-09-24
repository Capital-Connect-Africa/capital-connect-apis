import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsString()
    @IsOptional()
    currency?: string;

    @IsNumber()
    @IsOptional()
    amount?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    orderTrackingId: string;

    @IsNumber()
    @IsOptional()
    bookingId?: number;

    @IsNumber()
    @IsOptional()
    userSubscriptionId?: number;

    @IsNumber()
    userId: number;

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @IsString()
    @IsOptional()
    updatedAt?: Date;
}
