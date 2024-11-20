import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { FinancialQuestions } from './entities/finance.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FinancesService {
  constructor(
    @InjectRepository(FinancialQuestions)
    private readonly financeRepository: Repository<FinancialQuestions>,
  ) {}

  async create(createFinanceDto: CreateFinanceDto): 
  Promise<FinancialQuestions> {
    const existingFinance = await this.financeRepository.findOne({
      where: { question: createFinanceDto.question },
    });
  
    if (existingFinance) {
      throw new NotFoundException('This question already exists.'); 
    }
  
    const finance = this.financeRepository.create(createFinanceDto);
    return this.financeRepository.save(finance);
  }  

  async findAll(): Promise<FinancialQuestions[]> {
    try {
      const finances = await this.financeRepository.find();
  
      if (!finances.length) {
        throw new NotFoundException(`No financial information questions found.`);
      }
  
      return finances;
    } catch (error) {
      throw new Error('An error occurred while fetching financial information questions.');
    }
  }

  async findOne(id: number): Promise<FinancialQuestions> {
      const finance = await this.financeRepository.findOne({ where: { id } });
      if (!finance) {
        throw new NotFoundException(`Financial information question with id ${id} not found.`);
      }
  
      return finance;
  }

  async update(id: number, updateFinanceDto: UpdateFinanceDto): 
  Promise<FinancialQuestions> {
    const { question, description } = updateFinanceDto;
    const updates = {};

    if (question) updates['question'] = question;
    if (description) updates['description'] = description;
    if (Object.keys(updates).length > 0) {
      await this.financeRepository.update(id, updates);
    }
  
    return this.financeRepository.findOne({ where: { id } });
  }  

  async remove(id: number): Promise<void> {
    await this.financeRepository.delete(id); 
  }
}
