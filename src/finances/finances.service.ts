import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Finances } from './entities/finance.entity';
import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import { Revenue } from './entities/revenue.entity';
import { Opex } from './entities/opex.entity';
import { FinanceStatus } from './finance.enum';

@Injectable()
export class FinancesService {
  constructor(
    @InjectRepository(Finances)
    private readonly financeRepository: Repository<Finances>,
    @InjectRepository(Revenue)
    private readonly revenueRepository: Repository<Revenue>,
    @InjectRepository(Opex)
    private readonly opexRepository: Repository<Opex>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createFinanceDto: CreateFinanceDto, user: User): Promise<Finances> {
    const { companyId, year, revenues, opex, ...rest } = createFinanceDto;

    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} does not exist.`);
    }
  
    // Check if a financial record already exists for the given company and year
    const existingFinance = await this.financeRepository.findOne({
      where: {
        company: { id: companyId },
        year,
      },
      relations: ['revenues', 'opex'],
    });
  
    if (existingFinance) {
      throw new NotFoundException(
        'A financial record with the same year already exists for this company.'
      );
    }
    const finance = this.financeRepository.create({
      ...rest,
      year,
      company,
      user,
    });

    if (revenues) {
      finance.revenues = await this.revenueRepository.find({
        where: { id: In(revenues) },
      });
    }
    if (opex) {
      finance.opex = await this.opexRepository.find({
        where: { id: In(opex) },
      });
    }
  
    // Save the finance record
    return await this.financeRepository.save(finance);
  }    
  
  async findAll(): Promise<Finances[]> {
    try {
      const finances = await this.financeRepository.find({
        relations: ['revenues', 'opex', 'company', 'user'],
        select: {company: {id: true}, user: {username: true}},
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

  async findByCompanyId(companyId: number): Promise<Finances[]> {
    const finances = await this.financeRepository.find({ 
      where: { company: { id: companyId} },
      relations: ['revenues', 'opex'], 
    });

    if (!finances || finances.length === 0) {
      throw new NotFoundException(`Finances with Company ID ${companyId} not found`);
    }

    return finances;
  }

  async findOne(id: number): Promise<Finances> {
      const finance = await this.financeRepository.findOne({ 
        where: { id },
        relations: ['revenues', 'opex', 'company', 'user'], 
      });
      if (!finance) {
        throw new NotFoundException(`Financial information with id ${id} not found.`);
      }
  
      return finance;
  }

  async update(id: number, updateFinanceDto: any): Promise<Finances> {
    const { year, revenues, opex, costOfSales, ebitda, ebit, taxes } = updateFinanceDto;
  
    const finance = await this.financeRepository.findOne({
      where: { id },
      relations: ['revenues', 'opex'],
    });
  
    if (!finance) {
      throw new NotFoundException(`Finance record with ID ${id} not found`);
    }
  
    // Update basic fields if provided
    if (year !== undefined) finance.year = year;
    if (costOfSales !== undefined) finance.costOfSales = costOfSales;
    if (ebitda !== undefined) finance.ebitda = ebitda;
    if (ebit !== undefined) finance.ebit = ebit;
    if (taxes !== undefined) finance.taxes = taxes;
  
    // Update related entities
    if (revenues && revenues.length > 0) {
      finance.revenues = await this.revenueRepository.find({
        where: { id: In(revenues) },
      });
    }
  
    if (opex && opex.length > 0) {
      finance.opex = await this.opexRepository.find({
        where: { id: In(opex) },
      });
    }
  
    return await this.financeRepository.save(finance);
  }   
  
  async addNotes(id: number, updateData: any): Promise<Finances> {
    const { notes } = updateData; 
    const updates = {};
  
    if (notes) updates['notes'] = notes;  
    if (Object.keys(updates).length > 0) {
      await this.financeRepository.update(id, updates);  
    }
  
    return this.financeRepository.findOne({ where: { id } });  
  }

  async updateFinancialRecordStatus(id: number, newStatus: FinanceStatus): 
  Promise<Finances> {
    const finance = await this.financeRepository.findOne({ where: { id } });
  
    if (!finance) {
      throw new NotFoundException(`Finance record with ID ${id} not found`);
    }
  
    if (finance.status !== FinanceStatus.PENDING) {
      throw new NotFoundException('Only pending records can be updated');
    }
  
    finance.status = newStatus;
    await this.financeRepository.save(finance);
  
    return finance; 
  }
  
  // Helper methods
  async generateReport(id: number): Promise<Finances> {
    // Find the finance record
    const finance = await this.financeRepository.findOne({ 
      where: { id }, 
      relations: ['revenues', 'opex'] 
    });
  
    if (!finance) {
      throw new Error('Finance record not found');
    }
  
    // Map revenue and opex values to numbers
    const revenueValues = finance.revenues.map(revenue => Number(revenue.value));
    const opexValues = finance.opex.map(opex => Number(opex.value));
  
    // Calculate total revenues
    const totalRevenues = revenueValues.reduce((a, b) => a + b, 0);
  
    // Calculate gross profit
    const grossProfit = totalRevenues - Number(finance.costOfSales);
  
    // Calculate EBITDA
    const ebitdas = grossProfit - opexValues.reduce((a, b) => a + b, 0);
  
    // Calculate EBIT (EBITDA + ebit)
    const ebits = ebitdas + Number(finance.ebitda);
  
    // Calculate profit before tax
    const profitBeforeTax = ebits + Number(finance.ebit);
  
    // Calculate net profit
    const netProfit = profitBeforeTax - Number(finance.taxes);

    // Calculate percentage gross margin
    const grossMargin = (grossProfit / totalRevenues) * 100;

    // Calculate ebitdas margin
    const ebitdasMargin = (ebitdas / totalRevenues) * 100;
  
    return {
      ...finance,
      totalRevenues,
      grossProfit,
      ebitdas,
      ebits,
      profitBeforeTax,
      netProfit,
      grossMargin: Math.round(grossMargin) + '%',
      ebitdasMargin: Math.round(ebitdasMargin) + '%',
    };
  }  

  async approveRecord(id: number): Promise<Finances> {
    return this.updateFinancialRecordStatus(id, FinanceStatus.APPROVED);
  }
  
  async rejectRecord(id: number): Promise<Finances> {
    return this.updateFinancialRecordStatus(id, FinanceStatus.REJECTED);
  }  

  async remove(id: number): Promise<void> {
    await this.financeRepository.delete(id); 
  }
}
