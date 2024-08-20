import { IsArray, IsString } from "class-validator";

export class DeclineReasonsDto {
    @IsArray()
    declineReasons: string[];
  }