import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRevenueDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;
}