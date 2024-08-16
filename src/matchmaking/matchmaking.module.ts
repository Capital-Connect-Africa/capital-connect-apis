import { Module } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { MatchmakingController } from './matchmaking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities/company.entity';
import { InvestorProfile } from '../investor-profile/entities/investor-profile.entity';
import { Sector } from '../sector/entities/sector.entity';
import { SubSector } from '../subsector/entities/subsector.entity';
import { User } from '../users/entities/user.entity';
import { Submission } from '../submission/entities/submission.entity';
import { Question } from '../question/entities/question.entity';
import { Answer } from '../answer/entities/answer.entity';
import { CompanyModule } from '../company/company.module';
import { InvestorProfileModule } from '../investor-profile/investor-profile.module';
import { ContactPerson } from '../contact-person/entities/contact-person.entity';
import { Matchmaking } from './entities/matchmaking.entity';
import { MatchDeclineReason } from './entities/match-decline.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      User,
      Submission,
      Question,
      Answer,
      InvestorProfile,
      Sector,
      SubSector,
      ContactPerson,
      Matchmaking,
      MatchDeclineReason
    ]),
    CompanyModule,
    InvestorProfileModule,
  ],
  providers: [MatchmakingService],
  controllers: [MatchmakingController],
})
export class MatchmakingModule {}
