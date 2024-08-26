import { IsArray, IsOptional } from 'class-validator';

export class DeclineReasonsDto {
  @IsArray()
  @IsOptional()
  declineReasons: string[];
}
