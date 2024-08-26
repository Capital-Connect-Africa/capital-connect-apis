import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('users')
  async getUserStatistics() {
    return this.statisticsService.getUserStatistics();
  }

  @Get('matchmaking')
  async getMatchMakingStatistics() {
    return this.statisticsService.getMatchMakingStatistics();
  }

  @Get('matchmaking/:investorProfileId')
  async getMatchMakingStatisticsPerInvestor(
    @Param('investorProfileId') investorId: number,
  ) {
    return this.statisticsService.getMatchMakingStatisticsPerInvestor(
      investorId,
    );
  }
}
