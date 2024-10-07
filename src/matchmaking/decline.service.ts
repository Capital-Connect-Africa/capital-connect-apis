import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeclineReason } from './entities/declineReasons.entity';
import { Repository } from 'typeorm';
import { CreateDeclineReasonDto } from './dto/create-decline-reason.dto';
import { UpdateDeclineReasonDto } from './dto/update-decline-reason.dto';

@Injectable()
export class DeclineService {
  constructor(
    @InjectRepository(DeclineReason)
    private readonly declineReasonRepository: Repository<DeclineReason>,
  ) {}

  async create(createDeclineReasonDto: CreateDeclineReasonDto) {
    const reason = this.declineReasonRepository.create(createDeclineReasonDto);
    const reasons = await this.declineReasonRepository.save(reason);
    return reasons;
  }

  async findOne(id: number): Promise<DeclineReason> {
    const reason = await this.declineReasonRepository.findOne({
      where: { id },
    });
    if (!reason) {
      throw new NotFoundException('Decline reason with ID ${id} not found.');
    }
    return reason;
  }

  async findAll(page: number = 1, limit: number = 30): Promise<DeclineReason[]> {
    const skip = (page - 1) * limit;
    return this.declineReasonRepository.find({
      skip,
      take: limit,
      order: {id: 'DESC'},
    });
  }

  async update(
    id: number,
    updateDeclineReasonDto: UpdateDeclineReasonDto,
  ): Promise<DeclineReason> {
    const reason = await this.declineReasonRepository.findOne({
      where: { id },
    });

    if (!reason) {
      throw new NotFoundException(`Decline reason with ID ${id} not found.`);
    }

    Object.assign(reason, updateDeclineReasonDto);
    return this.declineReasonRepository.save(reason);
  }

  async remove(id: number): Promise<void> {
    this.declineReasonRepository.delete({ id });
  }
}
