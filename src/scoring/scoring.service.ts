import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { CreateScoringDto } from './dto/create-scoring.dto';
import { UpdateScoringDto } from './dto/update-scoring.dto';
import { Scoring } from './entities/scoring.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoringType } from './scoring.type';

@Injectable()
export class ScoringService {
  constructor(
    @InjectRepository(Scoring)
    private scoringsRepository: Repository<Scoring>,
    @Inject('CustomLogger') private readonly logger: LoggerService,
  ) {}

  async create(createScoringDto: CreateScoringDto) {
    const scoring = await this.scoringsRepository.save(createScoringDto);
    return scoring;
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.scoringsRepository.find({
      skip,
      take: limit,
    });
  }

  async findOne(id: number) {
    const scoring = await this.scoringsRepository.findOneBy({ id });
    if (!scoring) {
      throw new NotFoundException(`Scoring with id ${id} not found`);
    }
    return scoring;
  }

  async update(id: number, updateScoringDto: UpdateScoringDto) {
    const { score, comment, implication, action, recommendation, type } =
      updateScoringDto;
    const updates = {};
    if (score) updates['score'] = score;
    if (comment) updates['comment'] = comment;
    if (implication) updates['implication'] = implication;
    if (action) updates['action'] = action;
    if (recommendation) updates['recommendation'] = recommendation;
    if (type) updates['type'] = type;
    if (Object.keys(updates).length > 0)
      await this.scoringsRepository.update(id, updateScoringDto);
    return this.scoringsRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.scoringsRepository.delete(id);
  }

  async getScoring(userScore: number, type: string) {
    let band = '71%-100%';

    if (userScore <= 30) {
      band = '0%-30%';
    } else if (userScore <= 50) {
      band = '31%-50%';
    } else if (userScore <= 70) {
      band = '51%-70%';
    }

    let scoreType = ScoringType.ELIGIBILITY;

    if (ScoringType[type]) {
      scoreType = type as ScoringType;
    } else {
      this.logger.error(
        `Invalid scoring type: ${type}`,
        'ScoringService.getScoring',
      );
    }

    return await this.scoringsRepository.findOne({
      where: { score: band, type: scoreType },
    });
  }
}
