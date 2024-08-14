import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private countriesRepository: Repository<Country>,
  ) {
  }

  async findAll(): Promise<Country[]> {
    return this.countriesRepository.find();
  }

  async create(country: CreateCountryDto): Promise<Country> {
    return this.countriesRepository.save(country);
  }

  async bulkCreate(countries: CreateCountryDto[]): Promise<Country[]> {
    return this.countriesRepository.save(countries);
  }

  async findOne(id: number) {
    const country = await this.countriesRepository.findOneBy({ id });
    if (!country) {
      throw new NotFoundException(`Country with id ${id} not found`);
    }
    return country;
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const { name, code, phoneCode } = updateCountryDto;
    const updates = {};
    if (name) updates['name'] = name;
    if (code) updates['code'] = code;
    if (phoneCode) updates['phoneCode'] = phoneCode;
    if (Object.keys(updates).length > 0)
      await this.countriesRepository.update(id, updates);
    return this.countriesRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.countriesRepository.delete(id);
  }

  async updateDto(updateCountryDto: UpdateCountryDto) {
    const { name, code, phoneCode } = updateCountryDto;
    const country = await this.countriesRepository.findOneBy({ code });
    if (country) {
      const updates = {};
      if (name) updates['name'] = name;
      if (code) updates['code'] = code;
      if (phoneCode) updates['phoneCode'] = phoneCode;
      if (Object.keys(updates).length > 0)
        await this.countriesRepository.update(country.id, updates);
      return this.countriesRepository.findOneBy({ id: country.id });
    } else {
      return this.create(updateCountryDto as CreateCountryDto);
    }
  }
}
