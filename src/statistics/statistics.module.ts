import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Matchmaking } from "../matchmaking/entities/matchmaking.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Matchmaking])],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
