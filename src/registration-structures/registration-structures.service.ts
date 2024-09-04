import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegistrationStructureDto } from './dto/create-registration-structure.dto';
import { UpdateRegistrationStructureDto } from './dto/update-registration-structure.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationStructure } from './entities/registration-structure.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RegistrationStructuresService {
  constructor(
    @InjectRepository(RegistrationStructure)
    private registrationStructureRepository: Repository<RegistrationStructure>,
  ) {}
  async create(createRegistrationStructureDto: CreateRegistrationStructureDto) {
    return await this.registrationStructureRepository.save(
      createRegistrationStructureDto,
    );
  }

  findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return this.registrationStructureRepository.find({
      skip,
      take: limit,
      order: {
        title: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const funding = await this.registrationStructureRepository.findOneBy({
      id,
    });
    if (!funding) {
      throw new NotFoundException(
        `Registration Structure with id ${id} not found`,
      );
    }
    return funding;
  }

  async update(
    id: number,
    updateRegistrationStructureDto: UpdateRegistrationStructureDto,
  ) {
    const { title, description } = updateRegistrationStructureDto;
    const updates = {};
    if (title) updates['title'] = title;
    if (description) updates['description'] = description;
    if (Object.keys(updates).length > 0)
      await this.registrationStructureRepository.update(
        id,
        updateRegistrationStructureDto,
      );
    return this.registrationStructureRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.registrationStructureRepository.delete(id);
  }
}
