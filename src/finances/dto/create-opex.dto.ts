import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOpexDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;
}