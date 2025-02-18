import { ApiProperty } from '@nestjs/swagger';
import { isNumber, IsNumber, IsOptional, IsString } from 'class-validator';

export class InvestorsUsersSearchHistoryDto {
  @IsString()
  @ApiProperty({ description: 'Business sector' })
  sector: string;

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

  @IsString()
  @ApiProperty({ description: 'Business use of fund', required: false })
  useOfFunds: string;
}
