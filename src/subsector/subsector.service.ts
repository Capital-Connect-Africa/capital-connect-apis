import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSubSectorDto } from './dto/update-subsector.dto';
import { SubSector } from './entities/subsector.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubSectorService {

  constructor( 
    @InjectRepository(SubSector)
    private subSectorsRepository: Repository<SubSector>,
  ) {}

  async create(subSection: SubSector) {
    return await this.subSectorsRepository.save(subSection);
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.subSectorsRepository.find({
      skip,
      take: limit,
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const subsector = await this.subSectorsRepository.findOneBy({ id });
    if (!subsector) {
      throw new NotFoundException(`SubSector with id ${id} not found`);
    }
    return subsector;
  }

  async update(id: number, updateSubsectionDto: UpdateSubSectorDto) {
    const { sectorId, name, description } = updateSubsectionDto;
    const updates = {};
    if (name) updates['name'] = name;
    if (description) updates['description'] = description;
    if (Object.keys(updates).length > 0) await this.subSectorsRepository.update(id, updates);
    return this.subSectorsRepository.findOneBy({ id });
  }

  remove(id: number) {
   this.subSectorsRepository.delete(id);
  }

  async findSubsections(id: number): Promise<SubSector[]> {
    return this.subSectorsRepository.find({
      where: { sector: { id } }
    });
  }
}
