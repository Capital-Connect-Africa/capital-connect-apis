import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Opex } from "./entities/opex.entity";
import { CreateOpexDto } from "./dto/create-opex.dto";
import { Company } from "src/company/entities/company.entity";

@Injectable()
export class OpexService {
  constructor(
    @InjectRepository(Opex)
    private readonly opexRepository: Repository<Opex>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ){}

  async create(createOpexDto: CreateOpexDto): Promise<Opex> {
    const { companyId } = createOpexDto;
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
  
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} does not exist.`);
    }

    // Add year constraint
    const opexRecords = await this.opexRepository.find({ 
      where: { company: { id: companyId } }
    });

    if (opexRecords.length > 0) {
        const sortedRecords = opexRecords.sort((a, b) => a.year - b.year);
        const lastRecord = sortedRecords[sortedRecords.length - 1];

        if (createOpexDto.year !== lastRecord.year + 1) {
            throw new NotFoundException(
              `Opex year must be exactly one year after the last recorded year (${lastRecord.year}).`
            );
        }
    } else {
        if (!createOpexDto.year) {
            throw new NotFoundException('The first Opex record must have a valid year.');
        }
    }

    const opex = this.opexRepository.create({
      ...createOpexDto,
      company: { id: companyId }, 
    });
  
    return await this.opexRepository.save(opex);
  }   

  async findAll(): Promise<Opex[]> {
    return await this.opexRepository.find();
  }

  async findOne(id: number): Promise<Opex> {
    const opex = await this.opexRepository.findOne({ where: { id } });
    if (!opex) {
      throw new NotFoundException(`Opex with ID ${id} not found`);
    }
    return opex;
  }

  async findByCompanyId(companyId: number): Promise<Opex[]> {
    const opex = await this.opexRepository.find({
       where: { company: { id: companyId } }
    });
  
    if (!opex || opex.length === 0) {
      throw new NotFoundException(`Opex with Company ID ${companyId} not found`);
    }
  
    return opex;
  }

  async update(id: number, updateOpexData: Partial<Opex>): Promise<Opex> {
    const { description, value } = updateOpexData;
    const updates: Partial<Opex> = {};

    if (description !== undefined) updates.description = description;
    if (value !== undefined) updates.value = value;
  
    if (Object.keys(updates).length > 0) {
      await this.opexRepository.update(id, updates);
    }

    const updatedOpex = await this.opexRepository.findOne({ where: { id } });
    if (!updatedOpex) {
      throw new NotFoundException(`Opex with ID ${id} not found`);
    }
    return updatedOpex;
  } 

  async delete(id: number): Promise<void> {
    const opex = await this.opexRepository.findOne({ where: { id } });
    if (!opex) {
      throw new NotFoundException(`Opex with ID ${id} not found`);
    }
    await this.opexRepository.remove(opex);
  }
}