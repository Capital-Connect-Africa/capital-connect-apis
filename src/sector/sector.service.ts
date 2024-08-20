import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sector } from './entities/sector.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SectorService {
  constructor( 
    @InjectRepository(Sector)
    private sectionRepository: Repository<Sector>,
  ) {}

  async create(createSectorDto: CreateSectorDto) {
    return await this.sectionRepository.save(createSectorDto);
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.sectionRepository.find({
      skip,
      take: limit,
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const sector = await this.sectionRepository.findOneBy({ id });
    if (!sector) {
      throw new NotFoundException(`Sector with id ${id} not found`);
    }
    return sector;
  }

  async update(id: number, updateSectorDto: UpdateSectorDto) {
    const { name, description } = updateSectorDto;
    const updates = {};
    if (name) updates['name'] = name;
    if (description) updates['description'] = description;
    if (Object.keys(updates).length > 0) await this.sectionRepository.update(id, updateSectorDto);
    return this.sectionRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.sectionRepository.delete(id);
  }
}
