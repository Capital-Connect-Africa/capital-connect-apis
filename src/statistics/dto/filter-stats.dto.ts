import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator';

  export class FilterStatsDto {
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
    useOfFunds?: string[];
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    growthStages?: string[];
  }
  