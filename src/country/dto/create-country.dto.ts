import { IsString } from "class-validator";

export class CreateCountryDto {
    @IsString()
    name: string;
  
    @IsString()
    code: string; // ISO 3166-1 alpha-2 code

    @IsString()
    phone: string; // Phone dailing code.
}
