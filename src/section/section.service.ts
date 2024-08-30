import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
  ) {}

  async create(createSectionDto: CreateSectionDto) {
    return await this.sectionRepository.save(createSectionDto);
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.sectionRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: number) {
    const section = await this.sectionRepository.findOneBy({ id });
    if (!section) {
      throw new NotFoundException(`Section with id ${id} not found`);
    }
    return section;
  }

  async update(id: number, updateSectionDto: UpdateSectionDto) {
    const { name, description } = updateSectionDto;
    const updates = {};
    if (name) updates['name'] = name;
    if (description) updates['description'] = description;
    if (Object.keys(updates).length > 0)
      await this.sectionRepository.update(id, updateSectionDto);
    return this.sectionRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.sectionRepository.delete(id);
  }
}
