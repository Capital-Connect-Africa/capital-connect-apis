import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvestmentStructureDto } from './dto/create-investment-structure.dto';
import { UpdateInvestmentStructureDto } from './dto/update-investment-structure.dto';
import { InvestmentStructure } from './entities/investment-structure.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InvestmentStructuresService {
  constructor( 
    @InjectRepository(InvestmentStructure)
    private investmentStructureRepository: Repository<InvestmentStructure>,
  ) {}
  async create(createInvestmentStructureDto: CreateInvestmentStructureDto) {
    return await this.investmentStructureRepository.save(createInvestmentStructureDto);
  }

  findAll(page: number = 1, limit: number = 15) {
    const skip = (page - 1) * limit;
    return this.investmentStructureRepository.find({
      skip,
      take: limit,
      order:{
        title: 'ASC'
      }
    });
  }

  async findOne(id: number) {
    const investment = await this.investmentStructureRepository.findOneBy({ id });
    if (!investment) {
      throw new NotFoundException(`Investment structure with id ${id} not found`);
    }
    return investment;
  }

  async update(id: number, updateInvestmentStructureDto: UpdateInvestmentStructureDto) {
    const { title, description } = updateInvestmentStructureDto;
    const updates = {};
    if (title) updates['title'] = title;
    if (description) updates['description'] = description;
    if (Object.keys(updates).length > 0) await this.investmentStructureRepository.update(id, updateInvestmentStructureDto);
    return this.investmentStructureRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.investmentStructureRepository.delete(id);
  }
}
