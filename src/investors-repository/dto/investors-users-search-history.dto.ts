import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class InvestorsUsersSearchHistoryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Business sector' })
  sector: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Business revenue for the last year' })
  subSector: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Business country of operation' })
  country: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Amount the business is seeking to raise',
    required: false,
  })
  targetAmount: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Business use of fund', required: false })
  useOfFunds: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'A jwt encoding of the previous search', required: false })
  query: string
}
