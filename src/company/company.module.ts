import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import { Question } from 'src/question/entities/question.entity';
import { Answer } from 'src/answer/entities/answer.entity';
import { CompanyTypesController } from './company.types.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User, Submission, Question, Answer]),
  ],
  controllers: [CompanyController, CompanyTypesController],
  providers: [CompanyService, UsersService],
  exports: [CompanyService],
})
export class CompanyModule {}
