import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateContactPersonDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  designation: string;

  @IsEmail()
  emailAddress: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsNumber()
  investorProfileId: number;

  @IsBoolean()
  primaryContact: boolean;
}
