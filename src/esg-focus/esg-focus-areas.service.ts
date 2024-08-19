import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEsgFocusAreaDto } from './dto/create-esg-focus-area.dto';
import { UpdateEsgFocusAreaDto } from './dto/update-esg-focus-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EsgFocusAreas } from './entities/esg-focus-areas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EsgFocusAreasService {constructor(
  @InjectRepository(EsgFocusAreas)
  private esgFocusAreasRepository: Repository<EsgFocusAreas>,
) {}
async create(createEsgFocusAreaDto: CreateEsgFocusAreaDto) {
  return await this.esgFocusAreasRepository.save(createEsgFocusAreaDto);
}

findAll(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  return this.esgFocusAreasRepository.find({
    skip,
    take: limit,
    order:{
      title: 'ASC'
    }
  });
}

async findOne(id: number) {
  const esg = await this.esgFocusAreasRepository.findOneBy({ id });
  if (!esg) {
    throw new NotFoundException(`ESG focus area with id ${id} not found`);
  }
  return esg;
}

async update(id: number, updateEsgFocusAreaDto: UpdateEsgFocusAreaDto) {
  const { title, description } = updateEsgFocusAreaDto;
  const updates = {};
  if (title) updates['title'] = title;
  if (description) updates['description'] = description;
  if (Object.keys(updates).length > 0) await this.esgFocusAreasRepository.update(id, updateEsgFocusAreaDto);
  return this.esgFocusAreasRepository.findOneBy({ id });
}

remove(id: number) {
  this.esgFocusAreasRepository.delete(id);
}
}
