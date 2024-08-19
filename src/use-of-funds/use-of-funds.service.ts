import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUseOfFundsDto } from './dto/create-use-of-funds.dto';
import { UpdateUseOfFundsDto } from './dto/update-use-of-fund.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UseOfFunds } from './entities/use-of-funds.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UseOfFundsService {
  constructor(
    @InjectRepository(UseOfFunds)
    private useOfFundsRepository: Repository<UseOfFunds>,
  ) {}
  async create(createUseOfFundsDto: CreateUseOfFundsDto) {
    return await this.useOfFundsRepository.save(createUseOfFundsDto);
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.useOfFundsRepository.find({
      skip,
      take: limit,
      order:{
        title: 'ASC'
      }
    });
  }

  async findOne(id: number) {
    const funds = await this.useOfFundsRepository.findOneBy({ id });
    if (!funds) {
      throw new NotFoundException(`Use of funds with id ${id} not found`);
    }
    return funds;
  }

  async update(id: number, updateUseOfFundsDto: UpdateUseOfFundsDto) {
    const { title, description } = updateUseOfFundsDto;
    const updates = {};
    if (title) updates['title'] = title;
    if (description) updates['description'] = description;
    if (Object.keys(updates).length > 0) await this.useOfFundsRepository.update(id, updateUseOfFundsDto);
    return this.useOfFundsRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.useOfFundsRepository.delete(id);
  }
}
