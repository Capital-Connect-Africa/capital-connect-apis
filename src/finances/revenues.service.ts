import { Injectable, NotFoundException } from "@nestjs/common";
import { Revenue } from "./entities/revenue.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRevenueDto } from "./dto/create-revenue.dto";

@Injectable()
export class RevenuesService {
  constructor(
    @InjectRepository(Revenue)
    private readonly revenueRepository: Repository<Revenue>,
  ){}

  async create(createRevenueDto: CreateRevenueDto): Promise<Revenue> {
    return await this.revenueRepository.save(createRevenueDto)
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