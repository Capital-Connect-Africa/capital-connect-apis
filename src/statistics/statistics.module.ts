import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Matchmaking } from "../matchmaking/entities/matchmaking.entity";
import { SpecialCriterion } from 'src/special-criteria/entities/special-criterion.entity';
import { Company } from 'src/company/entities/company.entity';
import { InvestorProfile } from 'src/investor-profile/entities/investor-profile.entity';
import { Sector } from 'src/sector/entities/sector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Matchmaking, SpecialCriterion, Company, InvestorProfile, Sector])],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
