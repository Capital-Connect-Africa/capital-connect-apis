import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class DealPipelineDto {
  @IsInt()
  @ApiProperty({
    description: 'ID of the deal pipeline owner',
    type: 'integer',
    required: true,
  })
  ownerId?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Name of the deal pipeline', // default => 'Default Pipeline'
    required: false,
  })
  name?: string;

  @IsNumber()
  @ApiProperty({
    description: 'Maximum number of stages per pipeline', // default =7
    required: false,
  })
  maxNumberOfStages?: number;
}
