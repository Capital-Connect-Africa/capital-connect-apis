import { IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class CreateFinanceSubmissionDto{
    @IsNumber()
    @IsNotEmpty()
    year: number;
    
    @IsNumber()
    @IsOptional()
    amount: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    questionId: number;
}