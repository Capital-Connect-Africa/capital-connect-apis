import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { DealStatus } from 'src/shared/enums/deal.status.enum';

export class DealDto {
  @IsString()
  name: string;
  @ApiProperty({
    description: 'Name of the deal',
    required: true,
    uniqueItems: true,
  })
  @IsInt()
  @ApiProperty({
    description: 'The id of the current deal stage',
    type: 'integer',
    required: true,
  })
  stageId: number;

  @IsEnum(DealStatus)
  @IsOptional()
  @ApiProperty({
    description: 'Status of the deal',
    enum: DealStatus,
    required: true,
  })
  status?: DealStatus;

  @IsInt()
  @ApiProperty({
    description: 'A business linked to the current deal',
    type: 'integer',
    required: true,
  })
  customerId: number;

  @IsNumber()
  @ApiProperty({
    description: 'Value of the deal',
    type: 'integer',
    required: true,
  })
  value: number;

  @IsOptional()
  @ApiProperty({
    description: 'Date when the deal is closed',
    required: false,
  })
  closureDate?: Date;
}
