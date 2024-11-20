import { Module } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { FinancesController } from './finances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialQuestions } from './entities/finance.entity';
import { FinanceSubmission} from './entities/finance_submission.entity';
import { FinanceSubmissionService } from './finance-submission.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    FinancialQuestions, FinanceSubmission, User,
  ])],
  controllers: [FinancesController],
  providers: [FinancesService, FinanceSubmissionService],
})
export class FinancesModule {}
