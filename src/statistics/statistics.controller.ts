import { BadRequestException, Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { SpecialCriterion } from 'src/special-criteria/entities/special-criterion.entity';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

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
  @Roles(Role.Admin)
  async getTotalBusinesses(){
    return await this.statisticsService.getBusinessesStatistics();
  }

  @Get('businesses-stage')
  @Roles(Role.Admin)
  async getBusinessesPerStage() {
    return await this.statisticsService.getBusinessesPerStage();
  }

  @Get('businesses-fund')
  @Roles(Role.Admin)
  async getBusinessesPerFunds() {
    return await this.statisticsService.getBusinessesPerFundRaise();
  }

  @Get('businesses-country')
  @Roles(Role.Admin)
  async getBusinessesPerCountry() {
    return await this.statisticsService.getCompaniesPerCountry();
  }

  @Get('investors')
  @Roles(Role.Admin)
  async getTotalInvestors(){
    return await this.statisticsService.getInvestorsStatistics();
  }

  @Get('sectors-stats')
  @Roles(Role.Admin)
  async getStatsPerSector() {
    return await this.statisticsService.getInvestorsAndCompaniesPerSector();
  }

  @Get('funding-stats')
  @Roles(Role.Admin)
  async getStatsByFunding() {
    return await this.statisticsService.getInvestorsAndCompaniesByFunding();
  }

  @Get('subscription')
  @Roles(Role.Admin)
  async getSubscriptionStats() {
    return await this.statisticsService.getSubscriptionStatistics();
  }

  @Get('investors-funds')
  @Roles(Role.Admin)
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
      throw new Error('Error fetching booking statistics');
    }
  }
}
