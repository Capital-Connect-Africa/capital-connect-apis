import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, NotFoundException, BadRequestException } from '@nestjs/common';
import { CountryCodesService } from './country-codes.service';
import { CreateCountryCodeDto } from './dto/create-country-code.dto';
import { UpdateCountryCodeDto } from './dto/update-country-code.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CountryCode } from './entities/country-code.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import * as countryCodesData from 'src/country-codes/country-codes.json';
import throwInternalServer from 'src/shared/utils/exceptions.util';

@Controller('country-codes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CountryCodesController {
  constructor(private readonly countryCodesService: CountryCodesService) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() countryCode: CountryCode): Promise<CountryCode> {
    return this.countryCodesService.create(countryCode);
  }

  @Post('bulk')
  @Roles(Role.Admin)
  async bulkCreate(@Body() countryCodes: CountryCode[]): Promise<CountryCode[]> {
    return this.countryCodesService.bulkCreate(countryCodes);
  }

  @Get()
  async findAll(): Promise<CountryCode[]> {
    return this.countryCodesService.findAll();
  }

  @Get('bulklocal')
  @Roles(Role.Admin)
  async bulkCreateLocal(): Promise<{ success: boolean; data?: CountryCode[]; message?: string }> {
  const countryCode: CreateCountryCodeDto[] = countryCodesData.map((country) => ({
    name: country.name,
    code: country.code,
  }));

  try {
    const createdCodes = await this.countryCodesService.bulkCreate(countryCode);
    return { success: true, data: createdCodes };
  } catch (error) {
    return { success: false, message: 'Failed to create country codes' };
  }
}


  @Get(':id')
  findOne(@Param('id') id: number): Promise<CountryCode> {
    return this.countryCodesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateCountryCodeDto: UpdateCountryCodeDto) {
    try {
      await this.countryCodesService.findOne(+id);
      const country = await this.countryCodesService.update(+id, updateCountryCodeDto);
      return country;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Country code with id ${id} not found`);
      }
      throwInternalServer(error);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: number): Promise<void> {
    try {
      return this.countryCodesService.remove(id);
    } catch (error) {
      throwInternalServer(error);
    }
  }
}
