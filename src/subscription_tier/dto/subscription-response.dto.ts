import { ApiProperty } from "@nestjs/swagger"

export class SubscriptionResponseDto{
    @ApiProperty({description: 'Subscription unique identifier'})
    subscriptionId: number;

    @ApiProperty({description: 'PesaPal Order Tracking ID'})
    orderTrackingId: string;

    @ApiProperty({description: 'PesaPal payment prompt URL. Used in the iframe'})
    redirectUrl: string;

    @ApiProperty({description: 'Payment unique identifier'})
    paymentId: number;
}