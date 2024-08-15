import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecialCriterionDto } from './dto/create-special-criterion.dto';
import { UpdateSpecialCriterionDto } from './dto/update-special-criterion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialCriterion } from './entities/special-criterion.entity';
import { Repository } from 'typeorm';
import { AddQuestionDto } from './dto/add-question.dto';
import { Question } from 'src/question/entities/question.entity';

@Injectable()
export class SpecialCriteriaService {
  constructor(
    @InjectRepository(SpecialCriterion)
    private readonly specialCriteriaRepository: Repository<SpecialCriterion>,
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ){}

  async addQuestionsToSpecialCriteria(dto: AddQuestionDto) {
    const specialCriteria = await this.specialCriteriaRepository.findOne({
        where: { id: dto.specialCriteriaId },
        relations: ['questions'],
    });

    if (!specialCriteria) {
        throw new Error('SpecialCriteria not found');
    }

    const questions = await this.questionsRepository.findByIds(dto.questionIds);
    specialCriteria.questions.push(...questions);
    
    return this.specialCriteriaRepository.save(specialCriteria);
  }

  async create(createSpecialCriterionDto: CreateSpecialCriterionDto) {
    return await this.specialCriteriaRepository.save(createSpecialCriterionDto);
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.specialCriteriaRepository.find({
      skip,
      take: limit,
    });
  }

  findByInvestorProfileId(investorProfileId: number) {
    return this.specialCriteriaRepository.find({
      where: {
        investorProfile: { id: investorProfileId },
      },
    });
  }  

  findOne(id: number) {
    const special = this.specialCriteriaRepository.findOneBy( {id} );
    if (!special) {
      throw new NotFoundException(`Special criteria with id ${id} not found`);
    }
    return special;
  }

  async update(id: number, updateSpecialCriterionDto: UpdateSpecialCriterionDto) {
    const { title, description} = updateSpecialCriterionDto;
    const updates = {}
    if (title) updates['title'] = title;
    if (description) updates['description'] = description;
    if (Object.keys(updates).length > 0) await this.specialCriteriaRepository.update(id, updates);
    return this.specialCriteriaRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.specialCriteriaRepository.delete(id);
  }
}
