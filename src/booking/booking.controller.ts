import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookingService } from './booking.service';
import { PaymentService } from 'src/payment/payment.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PesapalToken } from 'src/shared/headers.decorators';
import { HttpService } from '@nestjs/axios';
import { VoucherService } from 'src/voucher/voucher.service';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(
    private readonly voucherService: VoucherService,
    private readonly bookingService: BookingService,
    private readonly paymentService: PaymentService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  async createBooking(
    @PesapalToken() pesapalToken: string,
    @Body() createBookingDto: CreateBookingDto,
    @Req() req,
  ) {
    const { calendlyEventId, notes, voucherCode } = createBookingDto;
    const user = req.user;
    const booking = await this.bookingService.createBooking(
      calendlyEventId,
      notes,
      user.id,
    );

    const bookingResponse = {} as any;
    bookingResponse.bookingId = booking.id;

    /* Thank you CTRL+C / CTRL+V 😀*/
    let amountDiscounted =0;
    let amount = +process.env.ADVISORY_SESSIONS_COST;

    if(voucherCode) { // redeem voucher if provided
      const result =await this.bookingService.redeemVoucher(user.id as number, voucherCode, amount);
      amountDiscounted =result.discount
      amount =result.amount; 

      // @NOTE: code implemented outside try/catch to throw errors due to voucher service 💀
    }
    try {
      const response = await this.httpService
        .post(
          `${process.env.PESAPAL_BASE_URL}/Transactions/SubmitOrderRequest`,
          {
            id: booking.id,
            currency: 'KES',
            amount,
            description: 'Advisory session booking fee.',
            callback_url: process.env.BOOKING_CALLBACK_URL,
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
              line_1: 'Rasin Capital',
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
      bookingResponse.orderTrackingId = res.order_tracking_id;
      bookingResponse.redirectUrl = res.redirect_url;
      const payment = await this.paymentService.createBookingPayment({
        bookingId: booking.id,
        orderTrackingId: res.order_tracking_id,
        userId: user.id,
      });
      bookingResponse.paymentId = payment.id;
    } catch (error) {
      console.error('Error', error);
      throw new HttpException(
        `Failed to initiate payment ${error.message}`,
        500,
      );
    }

    return bookingResponse;
  }

  @Get()
  findAll(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const user = req.user;
    return this.bookingService.findAll(user, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
