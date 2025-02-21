import { Injectable, NotFoundException } from "@nestjs/common";
import { Revenue } from "./entities/revenue.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRevenueDto } from "./dto/create-revenue.dto";
import { Company } from "src/company/entities/company.entity";

@Injectable()
export class RevenuesService {
  constructor(
    @InjectRepository(Revenue)
    private readonly revenueRepository: Repository<Revenue>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ){}

  async create(createRevenueDto: CreateRevenueDto): Promise<Revenue> {
    const { companyId } = createRevenueDto;
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
  
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} does not exist.`);
    }

    // Add year constraint
    const revenueRecords = await this.revenueRepository.find({ 
      where: { company: { id: companyId } }
    });

    if (revenueRecords.length > 0) {
        // Sort records by year
        const sortedRecords = revenueRecords.sort((a, b) => a.year - b.year);
        const lastRecord = sortedRecords[sortedRecords.length - 1];

        if (createRevenueDto.year !== lastRecord.year + 1) {
            throw new NotFoundException(
              `Revenue year must be exactly one year after the last recorded year (${lastRecord.year}).`
            );
        }
    } else {
        // First entry validation: Ensure a valid base year
        if (!createRevenueDto.year) {
            throw new NotFoundException('The first Revenue record must have a valid year.');
        }
    }
  
    const revenue = this.revenueRepository.create({
      ...createRevenueDto,
      company: { id: companyId }, 
    });
  
    return await this.revenueRepository.save(revenue);
  }  

  async findAll(): Promise<Revenue[]> {
    return await this.revenueRepository.find();
  }

  async findOne(id: number): Promise<Revenue> {
    const revenue = await this.revenueRepository.findOne({ where: { id } });
    if (!revenue) {
      throw new NotFoundException(`Revenue with ID ${id} not found`);
    }
    return revenue;
  }

  async findByCompanyId(companyId: number): Promise<Revenue[]> {
    const revenue = await this.revenueRepository.find({ 
      where: { company: { id: companyId} } 
    });

    if (!revenue || revenue.length === 0) {
      throw new NotFoundException(`Revenue with Company ID ${companyId} not found`);
    }

    return revenue;
  }
  
  async update(id: number, updateRevenueData: Partial<Revenue>): Promise<Revenue> {
    const { description, value } = updateRevenueData;
    const updates: Partial<Revenue> = {};

    if (description !== undefined) updates.description = description;
    if (value !== undefined) updates.value = value;
  
    if (Object.keys(updates).length > 0) {
      await this.revenueRepository.update(id, updates);
    }

    const updatedRevenue = await this.revenueRepository.findOne({ where: { id } });
    if (!updatedRevenue) {
      throw new NotFoundException(`Revenue with ID ${id} not found`);
    }
    return updatedRevenue;
  }  

  async delete(id: number): Promise<void> {
    const revenue = await this.revenueRepository.findOne({ where: { id } });
    if (!revenue) {
      throw new NotFoundException(`Revenue with ID ${id} not found`);
    }
    await this.revenueRepository.remove(revenue);
  }
}