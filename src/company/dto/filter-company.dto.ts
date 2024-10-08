import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsArray,
  IsNumber,
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
  @IsArray()
  @IsString({ each: true })
  segments?: string[];

  @IsOptional()
  @IsString()
  productsAndServices?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  registrationStructures?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  investmentStructure?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  useOfFunds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  esgFocusAreas?: string[];

  @IsOptional()
  @IsNumber()
  fundsNeeded?: number;

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
