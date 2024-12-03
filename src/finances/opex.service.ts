import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Opex } from "./entities/opex.entity";
import { CreateOpexDto } from "./dto/create-opex.dto";

@Injectable()
export class OpexService {
  constructor(
    @InjectRepository(Opex)
    private readonly opexRepository: Repository<Opex>,
  ){}

  async create(createOpexDto: CreateOpexDto): Promise<Opex> {
    return await this.opexRepository.save(createOpexDto)
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