import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { Submission } from './entities/submission.entity';
import { Question } from 'src/question/entities/question.entity';
import { Answer } from 'src/answer/entities/answer.entity';
import {
  IsAnswerExistsConstraint,
  IsQuestionExistsConstraint,
} from '../shared/validators/custom.validator';
import { SubSection } from 'src/subsection/entities/subsection.entity';
import { Section } from 'src/section/entities/section.entity';
import { SectionService } from 'src/section/section.service';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { SpecialCriteriaService } from '../special-criteria/special-criteria.service';
import { SpecialCriterion } from '../special-criteria/entities/special-criterion.entity';
import { SpecialCriterionQuestion } from '../special-criteria/entities/special-criterion-questions.entity';
import { Matchmaking } from '../matchmaking/entities/matchmaking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Submission,
      Question,
      Answer,
      SubSection,
      Section,
      SpecialCriterion,
      Question,
      SpecialCriterionQuestion,
      Matchmaking,
    ]),
  ],
  providers: [
    SubmissionService,
    SectionService,
    SpecialCriteriaService,
    PdfService,
    IsQuestionExistsConstraint,
    IsAnswerExistsConstraint,
  ],
  controllers: [SubmissionController, PdfController],
})
export class SubmissionModule {}
