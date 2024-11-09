import { IsEnum, IsString } from "class-validator";
import { DeclineRole } from "../MatchStatus.enum";

export class CreateDeclineReasonDto {
    @IsString()
    reason: string;

    @IsEnum(DeclineRole)
    declineRole: DeclineRole;
  }