import { IsArray, IsNotEmpty, IsNumber, IsOptional} from "class-validator";

export class CreateFinanceDto {
    @IsNumber()
    @IsNotEmpty()
    year: number;

    @IsNumber()
    costOfSales: number;

    @IsNumber()
    @IsOptional()
    ebitda: number;

    @IsNumber()
    @IsOptional()
    ebit: number;

    @IsNumber()
    @IsOptional()
    taxes: number;

    @IsArray()
    revenues: number[];

    @IsArray()
    opex: number[];

    @IsNumber()
    companyId: number;
}
