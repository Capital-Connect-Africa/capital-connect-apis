import { IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class VerifyMobileNumberDto {
  @IsString()
  @IsPhoneNumber()
  phoneNo: string;

  @IsString()
  @MinLength(6)
  otp: string;
}
