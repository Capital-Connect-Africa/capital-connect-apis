import { IsBoolean, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateSpecialCriterionDto {
    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    globalVisible?: boolean;

    @IsNumber()
    @IsOptional()
    investorProfileId: number;
}
