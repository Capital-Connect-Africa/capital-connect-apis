import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Currency } from 'src/shared/enums/currency.enum';

export class InvestorRepositoryDto {
  @IsString()
  @ApiProperty({ description: 'Unique investor name' })
  name: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Sector Names',
    isArray: true,
    required: false,
  })
  sectors: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Sub-sectors Names',
    isArray: true,
    required: false,
  })
  subSectors: string[];

  @IsString()
  @ApiProperty({ description: 'Investor type name', required: true })
  investorType: string;

  @IsOptional()
  @ApiProperty({
    description: 'Name of countries the investor operates in',
    isArray: true,
    required: false,
  })
  countries: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Investor ESG Focus areas',
    isArray: true,
    required: false,
  })
  esgFocusAreas: string[];

  @IsOptional()
  @ApiProperty({
    description: 'Business growth stages the investor is interested in',
    isArray: true,
    required: false,
  })
  businessGrowthStages: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Investors Investees names',
    type: 'string',
    isArray: true,
    required: false,
  })
  investees: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Investor investment structures',
    type: 'string',
    isArray: true,
    required: false,
  })
  investmentStructures: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Investors website',
    required: false,
  })
  website: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Minimum funding value',
    required: false,
  })
  minFunding: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Maximum funding value',
    required: false,
  })
  maxFunding: number;

  @IsOptional()
  @IsEnum(Currency)
  @ApiProperty({
    description: 'Value currency',
    enum: Currency,
    required: false,
  })
  currency: Currency;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'A brief description about the investor' })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Investors funding vehicle' })
  fundingVehicle: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Investors contact email' })
  contactEmail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Investors contact person name' })
  contactName: string;

  @IsArray()
  @ApiProperty({ description: 'Business use of fund', required: false })
  useOfFunds: string[];
}
