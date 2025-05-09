import { Injectable, NotFoundException } from "@nestjs/common";
import { CostOfSales } from "./entities/costs.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Company } from "src/company/entities/company.entity";
import { CreateCostOfSalesDto } from "./dto/create-costs.dto";

@Injectable()
export class CostOfSalesService {
  constructor(
    @InjectRepository(CostOfSales)
    private readonly costOfSalesRepository: Repository<CostOfSales>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ){}

  async create(createCostOfSalesDto: CreateCostOfSalesDto): Promise<CostOfSales> {
    const { companyId } = createCostOfSalesDto;
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
  
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} does not exist.`);
    }

    // Add year constraint
    const costOfSalesRecords = await this.costOfSalesRepository.find({ 
      where: { company: { id: companyId } }
    });

    if (costOfSalesRecords.length > 0) {
        const sortedRecords = costOfSalesRecords.sort((a, b) => a.year - b.year);
        const lastRecord = sortedRecords[sortedRecords.length - 1];

        if (createCostOfSalesDto.year !== lastRecord.year + 1) {
            throw new NotFoundException(
              `Cost of Sales year must be exactly one year after the last recorded year (${lastRecord.year}).`
            );
        }
    } else {
        if (!createCostOfSalesDto.year) {
            throw new NotFoundException('The first Cost of Sales record must have a valid year.');
        }
    }
  
    const CostOfSales = this.costOfSalesRepository.create({
      ...createCostOfSalesDto,
      company: { id: companyId }, 
    });
  
    return await this.costOfSalesRepository.save(CostOfSales);
  }  

  async findAll(): Promise<CostOfSales[]> {
    return await this.costOfSalesRepository.find();
  }

  async findOne(id: number): Promise<CostOfSales> {
    const CostOfSales = await this.costOfSalesRepository.findOne({ where: { id } });
    if (!CostOfSales) {
      throw new NotFoundException(`CostOfSales with ID ${id} not found`);
    }
    return CostOfSales;
  }

  async findByCompanyId(companyId: number): Promise<CostOfSales[]> {
    const CostOfSales = await this.costOfSalesRepository.find({ 
      where: { company: { id: companyId} } 
    });

    if (!CostOfSales || CostOfSales.length === 0) {
      throw new NotFoundException(`CostOfSales with Company ID ${companyId} not found`);
    }

    return CostOfSales;
  }
  
  async update(id: number, updateCostOfSalesData: Partial<CostOfSales>): Promise<CostOfSales> {
    const { description, value } = updateCostOfSalesData;
    const updates: Partial<CostOfSales> = {};

    if (description !== undefined) updates.description = description;
    if (value !== undefined) updates.value = value;
  
    if (Object.keys(updates).length > 0) {
      await this.costOfSalesRepository.update(id, updates);
    }

    const updatedCostOfSales = await this.costOfSalesRepository.findOne({ where: { id } });
    if (!updatedCostOfSales) {
      throw new NotFoundException(`CostOfSales with ID ${id} not found`);
    }
    return updatedCostOfSales;
  }  

  async delete(id: number): Promise<void> {
    const CostOfSales = await this.costOfSalesRepository.findOne({ where: { id } });
    if (!CostOfSales) {
      throw new NotFoundException(`CostOfSales with ID ${id} not found`);
    }
    await this.costOfSalesRepository.remove(CostOfSales);
  }
}