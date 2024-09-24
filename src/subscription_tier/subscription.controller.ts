import { Controller, Post, Param, ParseIntPipe, Get, UseGuards, Body, Req, HttpException } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { HeadersToken } from "../shared/headers.decorators";
import { CreateBookingDto } from "../booking/dto/create-booking.dto";
import { HttpService } from "@nestjs/axios";
import { IsNumber } from "class-validator";
import { PaymentService } from "../payment/payment.service";

class SubscribrDto {
  @IsNumber()
  subscriptionId: number
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService, private readonly httpService: HttpService, private readonly paymentService: PaymentService,) {}

  @Post(':userId/:subscriptionId')
  @Roles(Role.Admin)
  async assignSubscription(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
  ) {
    return this.subscriptionService.assignSubscription(userId, subscriptionId);
  }

  @Get('validate/:userId')
  async validateSubscription(@Param('userId', ParseIntPipe) userId: number) {
    const hasSubscription = await this.subscriptionService.validateSubscription(userId);
    return { hasSubscription };
  }

  @Post('subscribe')
  async subscribe(
    @HeadersToken() pesapalToken: string,
    @Body() subscribrDto: SubscribrDto,
    @Req() req,
  ) {
    const user = req.user;
    const userSubscription = await this.subscriptionService.assignSubscription(user.id, subscribrDto.subscriptionId);
    const description = `Subscription ${userSubscription.subscriptionTier.name} payment`;
    const subscriptionResponse = {} as any;
    subscriptionResponse.subscriptionId = userSubscription.id;

    try {
      const response = await this.httpService
        .post(
          `${process.env.PESAPAL_BASE_URL}/Transactions/SubmitOrderRequest`,
          {
            id: userSubscription.id,
            currency: 'KES',
            amount: process.env.ADVISORY_SESSIONS_COST,
            description: description,
            callback_url: process.env.PESAPAL_CALLBACK_URL,
            redirect_mode: 'TOP_WINDOW',
            notification_id: process.env.PESAPAL_NOTIFICATION_ID,
            branch: 'Capital Connect Africa App',
            billing_address: {
              email_address: user.username,
              phone_number: '', // ToDo: Get user phone number
              country_code: 'KE',
              first_name: user.firstName,
              middle_name: user.lastName,
              last_name: user.lastName,
              line_1: 'Raisin Capital',
              line_2: '',
              city: '',
              state: '',
              postal_code: '',
              zip_code: '',
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${pesapalToken}`,
            },
          },
        )
        .toPromise();

      // Redirect url: https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=[order_tracking_id]
      const res = response.data;
      // console.log('Response', res);
      if (res.status !== '200')
        throw new HttpException(
          `Failed to initiate payment ${res.message}`,
          500,
        );
      subscriptionResponse.orderTrackingId = res.order_tracking_id;
      subscriptionResponse.redirectUrl = res.redirect_url;
      const payment = await this.paymentService.createPayment({
        userSubscriptionId: userSubscription.id,
        orderTrackingId: res.order_tracking_id,
        userId: user.id,
      },
        userSubscription.subscriptionTier.price,
        description,);
      subscriptionResponse.paymentId = payment.id;
    } catch (error) {
      console.error('Error', error);
      throw new HttpException(
        `Failed to initiate payment ${error.message}`,
        500,
      );
    }

    return subscriptionResponse;
  }
}