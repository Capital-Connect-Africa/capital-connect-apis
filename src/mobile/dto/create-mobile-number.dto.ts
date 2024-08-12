import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateMobileNumberDto {
  @IsString()
  @IsPhoneNumber()
  phoneNo: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsNumber()
  userId: number;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsString()
  @IsOptional()
  updatedAt?: Date;
}
