import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class CreateDealStageDto {
  @IsInt()
  @ApiProperty({
    description: 'ID of the deal stage owner',
    type: 'integer',
    required: true,
  })
  userId: number;

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
