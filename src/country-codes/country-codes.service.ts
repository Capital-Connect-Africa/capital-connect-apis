import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCountryCodeDto } from './dto/create-country-code.dto';
import { UpdateCountryCodeDto } from './dto/update-country-code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryCode } from './entities/country-code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountryCodesService {
  constructor(
    @InjectRepository(CountryCode)
    private countryCodesRepository: Repository<CountryCode>,
  ) {}
  
  async create(countryCode: CreateCountryCodeDto): Promise<CountryCode> {
    return this.countryCodesRepository.save(countryCode);
  }

  async bulkCreate(countryCode: CreateCountryCodeDto[]): Promise<CountryCode[]> {
    return this.countryCodesRepository.save(countryCode);
  }

  async findAll(): Promise<CountryCode[]> {
    return this.countryCodesRepository.find();
  }

  async findOne(id: number) {
    const countryCode = await this.countryCodesRepository.findOneBy({ id });
    if (!countryCode) {
      throw new NotFoundException(`Country code with id ${id} not found`);
    }
    return countryCode;
  }

  async update(id: number, updateCountryCodeDto: UpdateCountryCodeDto) {
    const { name, code } = updateCountryCodeDto;
    const updates = {};
    if (name) updates['name'] = name;
    if (code) updates['code'] = code;
    if (Object.keys(updates).length > 0)
      await this.countryCodesRepository.update(id, updateCountryCodeDto);
    return this.countryCodesRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.countryCodesRepository.delete(id);
  }
}
