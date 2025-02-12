import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBalanceSheetDto } from './dto/create-balance-sheet.dto';
import { UpdateBalanceSheetDto } from './dto/update-balance-sheet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceSheet } from './entities/balance-sheet.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class BalanceSheetService {
  constructor(
    @InjectRepository(BalanceSheet)
    private readonly balanceSheetRepository: Repository<BalanceSheet>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ){}
  async create(createBalanceSheetDto: CreateBalanceSheetDto): Promise<BalanceSheet> {
    const { companyId } = createBalanceSheetDto;
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
  
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} does not exist.`);
    }
  
    const balanceSheet = this.balanceSheetRepository.create({
      ...createBalanceSheetDto,
      company: { id: companyId },
    });

    balanceSheet.calculateFields();
    return await this.balanceSheetRepository.save(balanceSheet);
  }
  
  async findAll(): Promise<BalanceSheet[]> {
    return await this.balanceSheetRepository.find();
  }
  
  async findOne(id: number): Promise<BalanceSheet> {
    const balanceSheet = await this.balanceSheetRepository.findOne({ where: { id } });
    if (!balanceSheet) {
      throw new NotFoundException(`BalanceSheet with ID ${id} not found`);
    }
    return balanceSheet;
  }
  
  async findByCompanyId(companyId: number): Promise<BalanceSheet[]> {
    const balanceSheets = await this.balanceSheetRepository.find({ where: { company: { id: companyId } } });
  
    if (!balanceSheets || balanceSheets.length === 0) {
      throw new NotFoundException(`BalanceSheet with Company ID ${companyId} not found`);
    }
  
    return balanceSheets;
  }
  
  async update(id: number, updateBalanceSheetDto: UpdateBalanceSheetDto): Promise<BalanceSheet> {
    const { year, landProperty, plantEquipment, otherNonCurrentAssets, tradeReceivables, cash,
      inventory, otherCurrentAssets, tradePayables, otherCurrentLiabilities, loans,
      capital, otherNonCurrentLiabilities } = updateBalanceSheetDto;

    const balanceSheet = await this.findOne(id);
        if (!balanceSheet) {
          throw new BadRequestException(`Balance sheet with ID ${id} does not exist`);
        }

        if (year !== undefined) balanceSheet.year = year;
        if (landProperty !== undefined) balanceSheet.landProperty = landProperty;
        if (plantEquipment !== undefined) balanceSheet.plantEquipment = plantEquipment;
        if (otherNonCurrentAssets !== undefined) balanceSheet.otherNonCurrentAssets = otherNonCurrentAssets;
        if (tradeReceivables !== undefined) balanceSheet.tradeReceivables = tradeReceivables;
        if (cash !== undefined) balanceSheet.cash = cash;
        if (inventory !== undefined) balanceSheet.inventory = inventory;
        if (otherCurrentAssets !== undefined) balanceSheet.otherCurrentAssets = otherCurrentAssets;
        if (tradePayables !== undefined) balanceSheet.tradePayables = tradePayables;
        if (otherCurrentLiabilities !== undefined) balanceSheet.otherCurrentLiabilities = otherCurrentLiabilities;
        if (loans !== undefined) balanceSheet.loans = loans;
        if (capital !== undefined) balanceSheet.capital = capital;
        if (otherNonCurrentLiabilities !== undefined) balanceSheet.otherNonCurrentLiabilities = otherNonCurrentLiabilities;

        balanceSheet.calculateFields();
        return await this.balanceSheetRepository.save(balanceSheet);
  }
  
  async remove(id: number): Promise<void> {
    const balanceSheet = await this.balanceSheetRepository.findOne({ where: { id } });
    if (!balanceSheet) {
      throw new NotFoundException(`BalanceSheet with ID ${id} not found`);
    }
    await this.balanceSheetRepository.remove(balanceSheet);
  }  
}
