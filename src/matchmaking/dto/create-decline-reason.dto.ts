import { IsString } from "class-validator";

export class CreateDeclineReasonDto {
    @IsString()
    reason: string;
  }