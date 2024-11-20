import { IsString} from "class-validator";

export class CreateFinanceDto {
    @IsString()
    question: string;

    @IsString()
    description: string;
}
