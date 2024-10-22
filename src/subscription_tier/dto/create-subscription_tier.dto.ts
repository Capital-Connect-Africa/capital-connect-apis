import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { SubscriptionTierEnum } from "../../subscription/subscription-tier.enum";

export class CreateSubscriptionTierDto {
  @IsEnum(SubscriptionTierEnum)
  name: SubscriptionTierEnum;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  features: string[];

  @IsNumber()
  price: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
