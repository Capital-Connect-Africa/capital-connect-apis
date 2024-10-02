import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { Segment } from './entities/segment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SegmentService {
  constructor( 
    @InjectRepository(Segment)
    private segmentsRepository: Repository<Segment>,
  ) {}

  async createSegment(segments: Segment){
    return await this.segmentsRepository.save(segments);
  }
  

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.segmentsRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: number) {
    const segment = await this.segmentsRepository.findOneBy({ id });
    if (!segment) {
      throw new NotFoundException(`Segment with id ${id} not found`);
    }
    return segment;
  }

  async update(id: number, updateSegmentDto: UpdateSegmentDto) {
    const { subSectorId, name, description } = updateSegmentDto;
    const updates = {};
    if (name) updates['name'] = name;
    if (description) updates['description'] = description;
    if (Object.keys(updates).length > 0) await this.segmentsRepository.update(id, updates);
    return this.segmentsRepository.findOneBy({ id });
  }

  remove(id: number) {
   this.segmentsRepository.delete(id);
  }

  async findSegments(id: number): Promise<Segment[]> {
    return this.segmentsRepository.find({
      where: { subSector: { id } }
    });
  }
}
