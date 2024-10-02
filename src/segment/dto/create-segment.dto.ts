import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateSegmentDto {
    @MinLength(3)
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    subSectorId: number;
}
