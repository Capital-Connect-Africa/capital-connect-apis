import { IsInt, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { MaxYearConstraint } from "src/decorators/maxYear.decorator";

export class CreateRevenueDto {
    @IsNotEmpty()
    @IsInt()
    @Validate(MaxYearConstraint)
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