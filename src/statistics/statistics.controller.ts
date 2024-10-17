import { Body, Controller, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { FilterStatsDto } from './dto/filter-stats.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Post('stats-filter')
  @Roles(Role.Admin, Role.Investor)
  async filterStats(@Body() filterStatsDto: FilterStatsDto) {
    return this.statisticsService.statsFilter(filterStatsDto);
  }

  @Get('users')
  @Roles(Role.Admin)
  async getUserStatistics() {
    return this.statisticsService.getUserStatistics();
  }

  @Get('matchmaking')
  @Roles(Role.Admin)
  async getMatchMakingStatistics() {
    return this.statisticsService.getMatchMakingStatistics();
  }

  @Get('matchmaking/:id')
  @Roles(Role.Admin, Role.Investor, Role.User)
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
  @Roles(Role.Admin)
  async getSpecialCriteriaStatistics() {
    const statistics = await this.statisticsService.getSpecialCriteriaStatistics();
    return statistics;  
  }

  @Get('special-criteria/:id')
  @Roles(Role.Admin, Role.Investor)
  async getSpecialCriteriaStatisticsInvestor(
    @Param('id') id: number,
  ) {
    const statistics = await this.statisticsService.getSpecialCriteriaStatisticsInvestor(id);
    return statistics;  
  }

  @Get('businesses')
  @Roles(Role.Admin, Role.Investor)
  async getTotalBusinesses(){
    return await this.statisticsService.getBusinessesStatistics();
  }

  @Get('businesses-stage')
  @Roles(Role.Admin, Role.Investor)
  async getBusinessesPerStage() {
    return await this.statisticsService.getBusinessesPerStage();
  }

  @Get('businesses-fund')
  @Roles(Role.Admin, Role.Investor)
  async getBusinessesPerFunds() {
    return await this.statisticsService.getBusinessesPerFundRaise();
  }

  @Get('businesses-country')
  @Roles(Role.Admin, Role.Investor)
  async getBusinessesPerCountry() {
    return await this.statisticsService.getCompaniesPerCountry();
  }

  @Get('investors')
  @Roles(Role.Admin, Role.User)
  async getTotalInvestors(){
    return await this.statisticsService.getInvestorsStatistics();
  }

  @Get('sectors-stats')
  @Roles(Role.Admin, Role.User, Role.Investor)
  async getStatsPerSector() {
    return await this.statisticsService.getInvestorsAndCompaniesPerSector();
  }

  @Get('funding-stats')
  @Roles(Role.Admin, Role.User, Role.Investor)
  async getStatsByFunding() {
    return await this.statisticsService.getInvestorsAndCompaniesByFunding();
  }

  @Get('subscription')
  @Roles(Role.Admin)
  async getSubscriptionStats() {
    return await this.statisticsService.getSubscriptionStatistics();
  }

  @Get('investors-funds')
  @Roles(Role.Admin, Role.User)
  async getInvestorsPerFunding(
    @Query('type') type: 'minimumFunding' | 'maximumFunding'
  ) {
    if (type !== 'minimumFunding' && type !== 'maximumFunding') {
      throw new Error('Invalid funding type. Must be "minimumFunding" or "maximumFunding".');
    }

    return this.statisticsService.getInvestorsPerFunding(type);
  }

  @Get('requests/:id')
  @Roles(Role.Admin, Role.Investor)
  async getConnectionRequestStatistics(
    @Param('id') id: number,
  ) {
    const stats = await this.statisticsService.getConnectionRequestStatistics(id);
    return stats
  }  

  @Get('bookings')
  @Roles(Role.Admin)
  async getBookingStatistics() {
    try {
      const stats = await this.statisticsService.getBookingStatistics();
      return stats;
    } catch (error) {
      throw new Error('Error fetching booking statistics');
    }
  }

  @Get('payments')
  @Roles(Role.Admin)
  async getPaymentsStatistics() {
    try {
      const stats = await this.statisticsService.getPaymentsStatistics();
      return stats;
    } catch (error) {
      throw new Error('Error fetching payments statistics');
    }
  }

  @Get('payments/:id')
  @Roles(Role.Admin, Role.Investor, Role.User)
  async getPaymentsStatisticsByUserId(
    @Param('id') id: number,
  ) {
    try {
      const stats = await this.statisticsService.getPaymentsStatisticsByUserId(id);
      return stats;
    } catch (error) {
      throw new Error('Error fetching payment statistics');
    }
  }
}
