import { IsArray, IsNotEmpty } from "class-validator";

export class AddQuestionDto {
    @IsNotEmpty()
    specialCriteriaId: number;

    @IsArray()
    @IsNotEmpty({ each: true })
    questionIds: number[];
  }