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
import { UseOfFunds } from 'src/use-of-funds/entities/use-of-funds.entity';
import { Stage } from 'src/stage/entities/stage.entity';
import { Country } from 'src/country/entities/country.entity';
import { ConnectionRequest } from 'src/matchmaking/entities/connectionRequest.entity';
import { UserSubscription } from 'src/subscription_tier/entities/userSubscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    User, Matchmaking, SpecialCriterion, Company, InvestorProfile, Sector, UseOfFunds, Stage, Country,
    ConnectionRequest, UserSubscription,
  ])],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
