import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRevenueDto {
    @IsNumber()
    @IsNotEmpty()
    year: number;
    
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;

    @IsNumber()
    companyId: number;
}