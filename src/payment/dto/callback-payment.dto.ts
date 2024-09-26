import { IsString } from 'class-validator';

export class CallbackPaymentDto {
  @IsString()
  OrderTrackingId: string;

  @IsString()
  OrderNotificationType: string;

  @IsString()
  OrderMerchantReference: string;
}
