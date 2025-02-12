import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DealCustomerDto {
  @IsOptional()
  @ApiProperty({
    description: 'New customer name',
    required: false,
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    description: 'New customer email address',
    required: false,
  })
  email: string;

  @IsOptional()
  @ApiProperty({
    description: 'New customer phone number',
    required: false,
  })
  phone: string;

  @IsOptional()
  @ApiProperty({
    description: 'Existing customer ID',
    required: false,
  })
  userId: number;
}
