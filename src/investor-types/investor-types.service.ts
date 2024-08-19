import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvestorTypeDto } from './dto/create-investor-type.dto';
import { UpdateInvestorTypeDto } from './dto/update-investor-type.dto';
import { InvestorType } from './entities/investor-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InvestorTypesService {constructor(
  @InjectRepository(InvestorType)
  private investorTypeRepository: Repository<InvestorType>,
) {}
async create( createInvestorTypeDto: CreateInvestorTypeDto) {
  return await this.investorTypeRepository.save(createInvestorTypeDto);
}

findAll(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  return this.investorTypeRepository.find({
    skip,
    take: limit,
    order:{
      title: 'ASC'
    }
  });
}

async findOne(id: number) {
  const type = await this.investorTypeRepository.findOneBy({ id });
  if (!type) {
    throw new NotFoundException(`Investor type with id ${id} not found`);
  }
  return type;
}

async update(id: number, updateInvestorTypeDto: UpdateInvestorTypeDto) {
  const { title, description } = updateInvestorTypeDto;
  const updates = {};
  if (title) updates['title'] = title;
  if (description) updates['description'] = description;
  if (Object.keys(updates).length > 0) await this.investorTypeRepository.update(id, updateInvestorTypeDto);
  return this.investorTypeRepository.findOneBy({ id });
}

remove(id: number) {
  this.investorTypeRepository.delete(id);
}
}
