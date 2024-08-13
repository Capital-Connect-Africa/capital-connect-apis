import { IsString } from "class-validator";

export class CreateCountryCodeDto {
    @IsString()
    name: string;
  
    @IsString()
    code: string;
}
