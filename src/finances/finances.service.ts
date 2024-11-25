import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Finances } from './entities/finance.entity';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class FinancesService {
  constructor(
    @InjectRepository(Finances)
    private readonly financeRepository: Repository<Finances>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createFinanceDto: CreateFinanceDto): Promise<Finances> {
    const { companyId, year, description } = createFinanceDto;
  
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} does not exist.`);
    }
  
    const existingFinance = await this.financeRepository.findOne({
      where: {
        company: { id: companyId }, 
        year,
        description,
      },
    });
  
    if (existingFinance) {
      throw new NotFoundException(
        'A financial record with the same year and description already exists for this company.'
      );
    }

    // Create a new finance record
    const finance = this.financeRepository.create({
      ...createFinanceDto,
      company, 
    });
  
    return await this.financeRepository.save(finance);
  }  
  
  async findAll(): Promise<Finances[]> {
    try {
      const finances = await this.financeRepository.find({
        relations: ['company'],
        select: {company: {id: true}},
        order: {year: 'DESC'},
      });
  
      if (!finances.length) {
        throw new NotFoundException(`No financial information found.`);
      }
  
      return finances;
    } catch (error) {
      throw new Error('An error occurred while fetching financial information.');
    }
  }

  async findOne(id: number): Promise<Finances> {
      const finance = await this.financeRepository.findOne({ 
        where: { id },
        relations: ['company'], 
      });
      if (!finance) {
        throw new NotFoundException(`Financial information with id ${id} not found.`);
      }
  
      return finance;
  }

  async update(id: number, updateFinanceDto: UpdateFinanceDto): 
  Promise<Finances> {
    const { description, income, expenses, profits } = updateFinanceDto;
    const updates = {};

    if (description) updates['description'] = description;
    if (income) updates['income'] = income;
    if (expenses) updates['expenses'] = expenses;
    if (profits) updates['profits'] = profits;

    if (Object.keys(updates).length > 0) {
      await this.financeRepository.update(id, updates);
    }
  
    return this.financeRepository.findOne({ where: { id } });
  }  

  async remove(id: number): Promise<void> {
    await this.financeRepository.delete(id); 
  }
}
