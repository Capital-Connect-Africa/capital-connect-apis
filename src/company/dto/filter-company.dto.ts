import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { NumberOfEmployees, YearsOfOperation } from '../company.type';

export class FilterCompanyDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countries?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  businessSectors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  businessSubsectors?: string[];

  @IsOptional()
  @IsString()
  productsAndServices?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  registrationStructures?: string[];

  @IsOptional()
  @IsEnum(YearsOfOperation)
  yearsOfOperation?: YearsOfOperation;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  growthStages?: string[];

  @IsOptional()
  @IsEnum(NumberOfEmployees)
  numberOfEmployees?: NumberOfEmployees;

  @IsOptional()
  @IsBoolean()
  fullTimeBusiness?: boolean;
}
