import { IsNumber } from 'class-validator';

export class CreateConnectionRequestDto {
  @IsNumber()
  investorProfileId: number;

  @IsNumber()
  companyId: number;
}
