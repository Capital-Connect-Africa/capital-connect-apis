import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, Validate} from "class-validator";
import { MaxYearConstraint } from "src/decorators/maxYear.decorator";

export class CreateFinanceDto {
    @IsNotEmpty()
    @IsInt()
    @Validate(MaxYearConstraint)
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
