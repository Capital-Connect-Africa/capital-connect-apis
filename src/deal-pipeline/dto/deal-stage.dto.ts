import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class DealStageDto {
  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'ID of the pipeline id',
    type: 'integer',
    required: false,
  })
  pipelineId: number;

  @ApiProperty({
    description: 'Name of the deal stage',
    required: true,
  })
  name: string;

  @IsNumber()
  @ApiProperty({
    description: 'Progress of the deal as a percentage',
    required: true,
  })
  progress: number;
}
