import { Module } from '@nestjs/common';
import { CountryCodesService } from './country-codes.service';
import { CountryCodesController } from './country-codes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryCode } from './entities/country-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CountryCode])],
  controllers: [CountryCodesController],
  providers: [CountryCodesService],
})
export class CountryCodesModule {}
