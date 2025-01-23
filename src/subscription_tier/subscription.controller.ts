import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { PesapalToken } from '../shared/headers.decorators';
import { HttpService } from '@nestjs/axios';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentService } from '../payment/payment.service';
import { SubscriptionTierService } from './subscription_tier.service';
import { SubscriptionTierEnum } from '../subscription/subscription-tier.enum';
import {
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { ErrorDto } from 'src/shared/generic/error.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { UserSubscription } from './entities/userSubscription.entity';

class SubscribeDto {
  @IsNumber()
  @ApiProperty({ description: "Subscription tier's unique identifier" })
  subscriptionTierId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Discount voucher code to be applied',
    required: false,
  })
  voucherCode?: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly httpService: HttpService,
    private readonly paymentService: PaymentService,
    private readonly subscriptionTierService: SubscriptionTierService,
  ) {}

  @Post(':userId/:subscriptionId')
  @Roles(Role.Admin)
  async assignSubscription(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
  ) {
    return this.subscriptionService.assignNewSubscription(
      userId,
      subscriptionId,
    );
  }

  @Get('validate/:userId')
  async validateSubscription(@Param('userId', ParseIntPipe) userId: number) {
    const hasSubscription =
      await this.subscriptionService.validateSubscription(userId);
    return { hasSubscription };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Fetches user subscriptions' })
  @ApiOkResponse({
    description: 'A list of user subscriptions retrieved successfully',
    type: SubscriptionResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Login required. Possibly user session expired',
    type: ErrorDto,
  })
  @ApiForbiddenResponse({
    description: 'User access not allowed',
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async fetchSubscription(@Param('userId', ParseIntPipe) userId: number) {
    return await this.subscriptionService.fetchSubscription(userId);
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'User purchases a subscription' })
  @ApiOkResponse({
    description: 'Package bought successfully',
    type: SubscriptionResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Login required. Possibly user session expired',
    type: ErrorDto,
  })
  @ApiForbiddenResponse({
    description: 'User access not allowed',
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async subscribe(
    @PesapalToken() pesapalToken: string,
    @Body() subscribeDto: SubscribeDto,
    @Req() req,
  ) {
    const user = req.user;
    const subscriptionStatus =
      await this.subscriptionService.validateSubscription(user.id);
    if (subscriptionStatus) {
      throw new HttpException('User already has an active subscription', 400);
    }

    const { subscriptionTierId, voucherCode } = subscribeDto;
    const userSubscription = await this.subscriptionService.assignSubscription(
      user.id,
      subscriptionTierId,
    );
    const description = `Subscription ${userSubscription.subscriptionTier.name} payment`;
    const subscriptionResponse = {} as any;
    subscriptionResponse.subscriptionId = userSubscription.id;

    let amountDiscounted = 0;
    let amount = userSubscription.subscriptionTier.price;

    if (voucherCode) {
      // redeem voucher if provided
      const result = await this.subscriptionService.redeemVoucher(
        user.id as number,
        voucherCode,
        amount,
      );
      amountDiscounted = result.discount;
      amount = result.amount;

      // @NOTE: code implemented outside try/catch to throw errors due to voucher service 💀
    }

    try {
      const response = await this.httpService
        .post(
          `${process.env.PESAPAL_BASE_URL}/Transactions/SubmitOrderRequest`,
          {
            id: userSubscription.id,
            currency: 'KES',
            amount,
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
      const payment = await this.paymentService.createPayment(
        {
          userSubscriptionId: userSubscription.id,
          orderTrackingId: res.order_tracking_id,
          userId: user.id,
          discount: amountDiscounted,
        },
        Number(userSubscription.subscriptionTier.price),
        description,
      );
      subscriptionResponse.paymentId = payment.id;
    } catch (error) {
      console.error('Error', error);
      // console.log('Error response', JSON.stringify(error.response?.data));
      throw new HttpException(
        `Failed to initiate payment ${error.message}`,
        500,
      );
    }

    return subscriptionResponse;
  }

  @Post('upgrade')
  @ApiOperation({ summary: 'User upgrades to a new subscription' })
  @ApiOkResponse({
    description: 'Upgrade successful',
    type: SubscriptionResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Login required. Possibly user session expired',
    type: ErrorDto,
  })
  @ApiForbiddenResponse({
    description: 'User access not allowed',
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async upgradeUserSubscription(
    @PesapalToken() pesapalToken: string,
    @Body() subscribeDto: SubscribeDto,
    @Req() req,
  ) {
    const user = req.user;
    const { subscriptionTierId, voucherCode } = subscribeDto;
    const upgradeTier =
      await this.subscriptionTierService.findOne(subscriptionTierId);

    if (!upgradeTier) {
      throw new BadRequestException('Upgrade subscription tier is not valid.');
    }
    const userWithSubscription =
      await this.subscriptionService.canUpgradeUserSubscription(
        user.id,
        upgradeTier.name,
      );

    let currentTier = userWithSubscription.subscriptions?.find(
      (subscription) => subscription.isActive,
    ).subscriptionTier;

    if (!currentTier) {
      currentTier = await this.subscriptionTierService.findOneByName(
        SubscriptionTierEnum.BASIC,
      );
    }

    const userSubscription = await this.subscriptionService.assignSubscription(
      user.id,
      subscribeDto.subscriptionTierId,
    );
    const description = `Subscription ${userSubscription.subscriptionTier.name} payment`;
    const subscriptionResponse = {} as any;
    subscriptionResponse.subscriptionId = userSubscription.id;
    let amountDiscounted = 0;
    let amount = userSubscription.subscriptionTier.price - currentTier.price; // 😀 discount will be applied on this amount

    if (voucherCode) {
      // redeem voucher if provided
      const result = await this.subscriptionService.redeemVoucher(
        user.id as number,
        voucherCode,
        amount,
      );
      amountDiscounted = result.discount;
      amount = result.amount;
      // @NOTE: code implemented outside try/catch to throw errors due to voucher service 💀
    }
    try {
      const response = await this.httpService
        .post(
          `${process.env.PESAPAL_BASE_URL}/Transactions/SubmitOrderRequest`,
          {
            id: userSubscription.id,
            currency: 'KES',
            amount,
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
      console.log('Response', res);
      if (res.status !== '200')
        throw new HttpException(
          `Failed to initiate payment ${res.message}`,
          500,
        );
      subscriptionResponse.orderTrackingId = res.order_tracking_id;
      subscriptionResponse.redirectUrl = res.redirect_url;
      const payment = await this.paymentService.createPayment(
        {
          userSubscriptionId: userSubscription.id,
          orderTrackingId: res.order_tracking_id,
          userId: user.id,
        },
        Number(userSubscription.subscriptionTier.price),
        description,
      );
      subscriptionResponse.paymentId = payment.id;
    } catch (error) {
      console.error('Error', error);
      console.log('Error response', JSON.stringify(error.response?.data));
      throw new HttpException(
        `Failed to initiate payment ${error.message}`,
        500,
      );
    }

    return subscriptionResponse;
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Lists all subscription tiers' })
  @ApiOkResponse({ description: 'Subscriptions fetched successfully' })
  @ApiUnauthorizedResponse({
    description: 'Login required. Possibly user session expired',
    type: ErrorDto,
  })
  @ApiForbiddenResponse({
    description: 'User access not allowed',
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.subscriptionService.findAll(page, limit);
  }

  @Get(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get single subscription' })
  @ApiOkResponse({ description: 'Subscription retrieved successfully' })
  @ApiUnauthorizedResponse({
    description: 'Login required. Possibly user session expired',
    type: ErrorDto,
  })
  @ApiForbiddenResponse({
    description: 'User access not allowed',
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'A little server oopsy occured! Not your bad 😃',
    type: ErrorDto,
  })
  async findOne(@Param('id') id: number) {
    return this.subscriptionService.findOne(id);
  }

  @Post('status')
  @Roles(Role.Admin)
  async changeSubscriptionStatus(
    @Body() statusDto: { id: number; isActive: boolean },
  ) {
    return await this.subscriptionService.changeSubscriptionStatus(
      statusDto.id,
      statusDto.isActive,
    );
  }
}
