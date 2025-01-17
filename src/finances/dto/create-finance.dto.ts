import { IsArray, IsNotEmpty, IsNumber, IsOptional} from "class-validator";

export class CreateFinanceDto {
    @IsNumber()
    @IsNotEmpty()
    year: number;

    @IsNumber()
    @IsOptional()
    amorDep: number;

    @IsNumber()
    @IsOptional()
    interests: number;

    @IsNumber()
    @IsOptional()
    taxes: number;

    @IsArray()
    revenues: number[];

    @IsArray()
    opex: number[];

    @IsArray()
    costOfSales: number[];

    @IsNumber()
    companyId: number;
}
