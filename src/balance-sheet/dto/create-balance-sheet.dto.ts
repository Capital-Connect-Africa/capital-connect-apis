import { IsInt, IsNumber, Validate } from "class-validator";
import { MaxYearConstraint } from "src/decorators/maxYear.decorator";

export class CreateBalanceSheetDto {
    @IsInt()
    @Validate(MaxYearConstraint)
    year: number;

    @IsNumber()
    landProperty: number;

    @IsNumber()
    plantEquipment: number;

    @IsNumber()
    otherNonCurrentAssets: number;

    @IsNumber()
    tradeReceivables: number;

    @IsNumber()
    cash: number;

    @IsNumber()
    inventory: number;

    @IsNumber()
    otherCurrentAssets: number;

    @IsNumber()
    tradePayables: number;

    @IsNumber()
    otherCurrentLiabilities: number;

    @IsNumber()
    loans: number;

    @IsNumber()
    capital: number;

    @IsNumber()
    otherNonCurrentLiabilities: number;

    @IsNumber()
    companyId: number;
}
