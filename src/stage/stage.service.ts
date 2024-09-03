import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { Stage } from './entities/stage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StageService {
  constructor(
    @InjectRepository(Stage)
    private stagesRepository: Repository<Stage>,
  ) {}

  async create(createStageDto: CreateStageDto) {
    return await this.stagesRepository.save(createStageDto);
  }

  findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return this.stagesRepository.find({
      skip,
      take: limit,
      order: {
        title: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const stage = await this.stagesRepository.findOneBy({ id });
    if (!stage) {
      throw new NotFoundException(`Stage of business with id ${id} not found`);
    }
    return stage;
  }

  async update(id: number, updateStageDto: UpdateStageDto) {
    const { title, description } = updateStageDto;
    const updates = {};
    if (title) updates['title'] = title;
    if (description) updates['description'] = description;
    if (Object.keys(updates).length > 0)
      await this.stagesRepository.update(id, updateStageDto);
    return this.stagesRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.stagesRepository.delete(id);
  }
}
