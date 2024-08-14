import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CreateMobileNumberDto } from './dto/create-mobile-number.dto';
import { UpdateMobileNumberDto } from './dto/update-mobile-number.dto';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { MobileNumberService } from './mobile-number.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MobileNumber } from './entities/mobile-number.entity';
import { Repository } from 'typeorm';
import { generateOtp } from '../shared/utils/otp.util';
import { OtpService } from './otp.service';
import { VerifyMobileNumberDto } from './dto/verify-mobile-number.dto';

@Controller('mobile-numbers')
export class MobileNumberController {
  constructor(
    private readonly mobileService: MobileNumberService,
    private readonly otpService: OtpService,
    @InjectRepository(MobileNumber)
    private readonly mobileNumbersRepository: Repository<MobileNumber>,
  ) {}

  @Post()
  async create(@Body() createMobileDto: CreateMobileNumberDto) {
    try {
      const mobileNo = await this.mobileService.create(createMobileDto);
      mobileNo.otp = generateOtp();
      const sevedMobileNo = await this.mobileNumbersRepository.save(mobileNo);

      const message = `Your OTP code is ${sevedMobileNo.otp}`;
      const res = await this.otpService.sendSms(
        createMobileDto.phoneNo,
        message,
      );
      console.log('res', res);

      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.mobileService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.mobileService.findOne(+id);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMobileDto: UpdateMobileNumberDto,
  ) {
    try {
      await this.mobileService.findOne(+id);
      const mobile = await this.mobileService.update(+id, updateMobileDto);
      return mobile;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Mobile with id ${id} not found`);
      }
      throwInternalServer(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.mobileService.remove(+id);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Post('verify')
  async verifyOtp(
    @Body() verifyMobileNumberDto: VerifyMobileNumberDto,
  ): Promise<any> {
    const record = await this.mobileNumbersRepository.findOne({
      where: {
        phoneNo: verifyMobileNumberDto.phoneNo,
      },
    });

    if (!record) {
      return { success: false, message: 'Mobile number not found' };
    }

    if (record.otp !== verifyMobileNumberDto.otp) {
      return { success: false, message: 'Invalid OTP' };
    }
    record.isVerified = true;
    await this.mobileNumbersRepository.save(record);
    return { success: true, message: 'OTP verified successfully' };
  }
}
