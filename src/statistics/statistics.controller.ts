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
  async getBusinessesPerStage(@Query('stage') stage?: string) {
    if(stage){
      const businesses = await this.statisticsService.getBusinessesPerStage(stage);
      return businesses;
    } else{
      const businesses = await this.statisticsService.getBusinessesStatistics();
      return businesses;
    }
  }

  @Get('businesses-country')
  async getBusinessesPerCountry(@Query('country') country?: string) {
    if (country) {
      const businesses = await this.statisticsService.getBusinessesPerCountry(country);
      return businesses;
    } else {
      const businesses = await this.statisticsService.getBusinessesStatistics();
      return businesses;
    }
  }

  @Get('businesses-sector')
  async getBusinessesPerSector(@Query('sector') sector?: string) {
    if (sector) {
      const businesses = await this.statisticsService.getBusinessesPerSector(sector);
      return businesses;
    } else {
      const businesses = await this.statisticsService.getBusinessesStatistics();
      return businesses;
    }
  }

  @Get('businesses-funds')
  async getBusinessesPerFunds(@Query('funds') funds?: string) {
    if (funds) {
      const fundsNumber = parseFloat(funds);
      if (isNaN(fundsNumber)) {
        throw new BadRequestException('Invalid funds parameter');
      }
      const businesses = await this.statisticsService.getBusinessesPerFundsNeeded(fundsNumber);
      return businesses;
    } else {
      const businesses = await this.statisticsService.getBusinessesStatistics();
      return businesses;
    }
  }

  @Get('investors')
  async getTotalInvestors(){
    return await this.statisticsService.getInvestorsStatistics();
  }

  @Get('investors-sector')
  async getInvestorsPerSector(@Query('sector') sector?: string) {
    if (sector) {
      const businesses = await this.statisticsService.getInvestorsPerSector(sector);
      return businesses;
    } else {
      const businesses = await this.statisticsService.getInvestorsStatistics();
      return businesses;
    }
  }

  @Get('investors-minfunds')
  async getInvestorsPerMinFunds(@Query('minFunds') minFunds?: string) {
    if (minFunds) {
      const fundsNumber = parseFloat(minFunds);
      if (isNaN(fundsNumber)) {
        throw new BadRequestException('Invalid funds parameter');
      }
      const businesses = await this.statisticsService.getInvestorsPerMinimumFunding(fundsNumber);
      return businesses;
    } else {
      const businesses = await this.statisticsService.getInvestorsStatistics();
      return businesses;
    }
  }

  @Get('investors-maxfunds')
  async getInvestorsPerMaxFunds(@Query('maxFunds') maxFunds?: string) {
    if (maxFunds) {
      const fundsNumber = parseFloat(maxFunds);
      if (isNaN(fundsNumber)) {
        throw new BadRequestException('Invalid funds parameter');
      }
      const businesses = await this.statisticsService.getInvestorsPerMaximumFunding(fundsNumber);
      return businesses;
    } else {
      const businesses = await this.statisticsService.getInvestorsStatistics();
      return businesses;
    }
  }

  @Get('investors-funding')
  async getInvestorsPerFunding(@Query('fundType') fundType?: string) {
    if (fundType) {
      const businesses = await this.statisticsService.getInvestorsPerFundingType(fundType);
      return businesses;
    } else {
      const businesses = await this.statisticsService.getInvestorsStatistics();
      return businesses;
    }
  }
}
