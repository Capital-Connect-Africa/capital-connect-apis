import { IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateFinanceDto {
    @IsString()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    year: number;

    @IsNumber()
    income: number;

    @IsNumber()
    @IsOptional()
    expenses: number;

    @IsNumber()
    @IsOptional()
    profits: number;

    @IsNumber()
    companyId: number;
}
