import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnswerService {

  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>
  ) {}

  create(answer: Answer) {
    return this.answerRepository.save(answer);
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.answerRepository.find({
      skip,
      take: limit,
      order: {
        id: 'DESC', 
      },
    });
  }

  async findOne(id: number) {
    const answer = await this.answerRepository.findOneBy({ id });
    if (!answer) {
      throw new NotFoundException(`Answer with id ${id} not found`);
    }
    return answer
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto) {
    const { questionId, text, weight, recommendation} = updateAnswerDto;
    const updates = {};
    if (text) updates['text'] = text;
    if (weight) updates['weight'] = weight;
    if (recommendation) updates['recommendation'] = recommendation;
    if (Object.keys(updates).length > 0) await this.answerRepository.update(id, updates);
    const answer = await this.answerRepository.findOneBy({ id });
    return answer;
  }

  async remove(id: number) {
    this.answerRepository.delete(id);
    return id;
  }
}
