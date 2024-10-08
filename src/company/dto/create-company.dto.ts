import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { NumberOfEmployees, YearsOfOperation } from '../company.type';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  businessSector: string;

  @IsString()
  @IsOptional()
  businessSubsector: string;

  @IsArray()
  @IsOptional()
  segments: string[];

  @IsString()
  @IsNotEmpty()
  productsAndServices: string;

  @IsString()
  @IsNotEmpty()
  registrationStructure: string;

  @IsString()
  @IsNotEmpty()
  investmentStructure: string;

  @IsString()
  @IsNotEmpty()
  useOfFunds: string;

  @IsString()
  @IsNotEmpty()
  esgFocusAreas: string;

  @IsNumber()
  fundsNeeded: number;

  @IsNotEmpty()
  @IsEnum(YearsOfOperation)
  yearsOfOperation: YearsOfOperation;

  @IsString()
  @IsNotEmpty()
  growthStage: string;

  @IsNotEmpty()
  @IsEnum(NumberOfEmployees)
  numberOfEmployees: NumberOfEmployees;

  @IsBoolean()
  @IsNotEmpty()
  fullTimeBusiness: boolean;
}
