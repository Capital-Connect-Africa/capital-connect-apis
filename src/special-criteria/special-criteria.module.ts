import { Module } from '@nestjs/common';
import { SpecialCriteriaService } from './special-criteria.service';
import { SpecialCriteriaController } from './special-criteria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialCriterion } from './entities/special-criterion.entity';
import { Question } from 'src/question/entities/question.entity';
import { SpecialCriterionQuestion } from './entities/special-criterion-questions.entity';
import { Matchmaking } from '../matchmaking/entities/matchmaking.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpecialCriterion,
      Question,
      SpecialCriterionQuestion,
      Matchmaking,
      Submission,
      User,
      Company,
    ]),
  ],
  controllers: [SpecialCriteriaController],
  providers: [SpecialCriteriaService],
})
export class SpecialCriteriaModule {}
