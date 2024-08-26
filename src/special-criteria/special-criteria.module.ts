import { Module } from '@nestjs/common';
import { SpecialCriteriaService } from './special-criteria.service';
import { SpecialCriteriaController } from './special-criteria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialCriterion } from './entities/special-criterion.entity';
import { Question } from 'src/question/entities/question.entity';
import { SpecialCriterionQuestion } from "./entities/special-criterion-questions.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SpecialCriterion, Question, SpecialCriterionQuestion])],
  controllers: [SpecialCriteriaController],
  providers: [SpecialCriteriaService],
})
export class SpecialCriteriaModule {}
