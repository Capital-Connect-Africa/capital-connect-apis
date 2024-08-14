import { IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  name: string;

  @IsString()
  code: string; // ISO 3166-1 alpha-2 code

  @IsString()
  phoneCode: string; // Phone dailing code.
}
