import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import * as countriesData from './countries.json'; // Create a JSON file with country data
import { UpdateCountryDto } from './dto/update-country.dto';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Controller('countries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CountryController {
  constructor(private readonly countriesService: CountryService) {}

  @Get()
  async findAll(): Promise<Country[]> {
    return this.countriesService.findAll();
  }

  @Post()
  @Roles(Role.Admin)
  async create(@Body() country: Country): Promise<Country> {
    return this.countriesService.create(country);
  }

  @Post('bulk')
  @Roles(Role.Admin)
  async bulkCreate(@Body() countries: Country[]): Promise<Country[]> {
    return this.countriesService.bulkCreate(countries);
  }

  @Get('bulklocal')
  @Roles(Role.Admin)
  async bulkCreateLocal(): Promise<Country[]> {
    const countries: CreateCountryDto[] = countriesData.map((country) => ({
      name: country.name,
      code: country.code,
      phoneCode: country.phoneCode,
    }));

    return await this.countriesService.bulkCreate(countries);
  }

  @Get('bulkupdatelocal')
  @Roles(Role.Admin)
  async bulkUpdateLocal(): Promise<Promise<Country | null>[]> {
    const countries: CreateCountryDto[] = countriesData.map((country) => ({
      name: country.name,
      code: country.code,
      phoneCode: country.phoneCode,
    }));

    return countries.map((updateCountryDto) => {
      return this.countriesService.updateDto(updateCountryDto);
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Country> {
    return this.countriesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    try {
      await this.countriesService.findOne(+id);
      const country = await this.countriesService.update(+id, updateCountryDto);
      return country;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Country with id ${id} not found`);
      }
      throwInternalServer(error);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: number): Promise<void> {
    try {
      return this.countriesService.remove(id);
    } catch (error) {
      throwInternalServer(error);
    }
  }
}
