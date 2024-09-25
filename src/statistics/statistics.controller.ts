import { BadRequestException, Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { SpecialCriterion } from 'src/special-criteria/entities/special-criterion.entity';

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

  @Get('matchmaking/:id')
  async getMatchMakingStatisticsPerCompany(
    @Param('id') id: number,
    @Query('role') role: 'company' | 'investor',
  ) {
    if (role === 'company') {
      return this.statisticsService.getMatchMakingStatisticsPerCompany(id);
    } else if (role === 'investor') {
      return this.statisticsService.getMatchMakingStatisticsPerInvestor(id);
    } else {
      throw new NotFoundException('Role not found or not valid');
    }
  }

  @Get('special-criteria')
  async getSpecialCriteriaStatistics() {
    const statistics = await this.statisticsService.getSpecialCriteriaStatistics();
    return statistics;  
  }

  @Get('special-criteria/:id')
  async getSpecialCriteriaStatisticsInvestor(
    @Param('id') id: number,
  ) {
    const statistics = await this.statisticsService.getSpecialCriteriaStatisticsInvestor(id);
    return statistics;  
  }

  @Get('businesses')
  async getTotalBusinesses(){
    return await this.statisticsService.getBusinessesStatistics();
  }

  @Get('businesses-stage')
  async getBusinessesPerStage() {
    return await this.statisticsService.getBusinessesPerStage();
  }

  @Get('businesses-fund')
  async getBusinessesPerFunds() {
    return await this.statisticsService.getBusinessesPerFundRaise();
  }

  @Get('businesses-country')
  async getBusinessesPerCountry() {
    return await this.statisticsService.getCompaniesPerCountry();
  }

  @Get('investors')
  async getTotalInvestors(){
    return await this.statisticsService.getInvestorsStatistics();
  }

  @Get('sectors-stats')
  async getStatsPerSector() {
    return await this.statisticsService.getInvestorsAndCompaniesPerSector();
  }

  @Get('funding-stats')
  async getStatsByFunding() {
    return await this.statisticsService.getInvestorsAndCompaniesByFunding();
  }

  @Get('investors-funds')
  async getInvestorsPerFunding(
    @Query('type') type: 'minimumFunding' | 'maximumFunding'
  ) {
    if (type !== 'minimumFunding' && type !== 'maximumFunding') {
      throw new Error('Invalid funding type. Must be "minimumFunding" or "maximumFunding".');
    }

    return this.statisticsService.getInvestorsPerFunding(type);
  }

  @Get('requests/:id')
  async getConnectionRequestStatistics(
    @Param('id') id: number,
  ) {
    const stats = await this.statisticsService.getConnectionRequestStatistics(id);
    return stats
  }
}
