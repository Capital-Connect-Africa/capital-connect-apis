import { IsArray, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import { Type } from "class-transformer";

export class CreateFinanceDto {

    @IsNumber()
    @IsNotEmpty()
    year: number;

    @IsArray()
    revenues: number[];

    @IsArray()
    opex: number[];

    @IsNumber()
    companyId: number;
}
