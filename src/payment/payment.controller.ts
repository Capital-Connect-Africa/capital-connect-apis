import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, NotFoundException, BadRequestException, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { HeadersToken } from '../shared/headers.decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { CallbackPaymentDto } from './dto/callback-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentsService: PaymentService) {}

  @Post('callback')
  callback(
    @HeadersToken() pesapalToken: string,
    @Body() callbackPaymentDto: CallbackPaymentDto
  ) {
    try {
      return this.paymentsService.processPaymentCallback(pesapalToken, callbackPaymentDto);
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async checkPaymentStatus(@HeadersToken() pesapalToken: string, @Query('orderTrackingId') orderTrackingId: string) {
    try {
      const response = await this.paymentsService.checkPaymentStatus(pesapalToken, orderTrackingId);
      return { redirectUrl: `https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=${orderTrackingId}`, ...response };
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createPaymentDto: CreatePaymentDto) {  
    try {
      return this.paymentsService.createBookingPayment(createPaymentDto);
    } catch (error) {
      throwInternalServer(error)
    }  
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.paymentsService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    try {
      return this.paymentsService.findOne(+id);
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    try {
      await this.paymentsService.findOne(+id);
      const payments = await this.paymentsService.update(+id, updatePaymentDto);
      return payments;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Payment with id ${id} not found`);
      }
      throwInternalServer(error)
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.paymentsService.remove(+id);
    } catch (error) {
      throwInternalServer(error)
    }
  }
}
