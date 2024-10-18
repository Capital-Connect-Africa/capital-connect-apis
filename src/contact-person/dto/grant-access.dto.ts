import { IsNumber } from 'class-validator';

export class GrantAccessDto {
  @IsNumber()
  contactPersonId: number;

  @IsNumber()
  investorProfileId: number;
}
