import { Module } from '@nestjs/common';
import { MobileNumberController } from './mobile-number.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileNumber } from './entities/mobile-number.entity';
import { MobileNumberService } from './mobile-number.service';
import { OtpService } from './otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([MobileNumber])],
  controllers: [MobileNumberController],
  providers: [MobileNumberService, OtpService],
})
export class MobileNumberModule {}
