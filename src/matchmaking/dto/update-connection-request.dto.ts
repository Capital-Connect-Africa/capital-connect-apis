import { IsBoolean, isNumber, IsNumber } from "class-validator";

export class UpdateConnectionRequestDto {
    @IsBoolean()
    isApproved?: boolean;
  
    @IsNumber()
    investorProfileId?: number;
  
    @IsNumber()
    companyId?: number;
  }