import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { Company } from '../company/entities/company.entity';
import { InvestorProfile } from '../investor-profile/entities/investor-profile.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FilterCompanyDto } from '../company/dto/filter-company.dto';

@UseGuards(JwtAuthGuard)
@Controller('matchmaking')
export class MatchmakingController {
  constructor(private matchmakingService: MatchmakingService) {}

  @Roles(Role.Investor)
  @Get('companies')
  async getMatchingCompanies(@Request() req): Promise<Company[]> {
    return this.matchmakingService.getMatchingCompanies(req.user.id);
  }

  @Roles(Role.User)
  @Get('investor-profiles')
  async getMatchingInvestorProfiles(
    @Request() req,
  ): Promise<InvestorProfile[]> {
    return this.matchmakingService.getMatchingInvestorProfiles(req.user.id);
  }

  @Post('interesting/:investorProfileId/:companyId')
  markAsInteresting(
    @Param('investorProfileId') investorProfileId: number,
    @Param('companyId') companyId: number,
  ) {
    return this.matchmakingService.markAsInteresting(
      investorProfileId,
      companyId,
    );
  }

  @Post('connect/:investorProfileId/:companyId')
  connectWithCompany(
    @Param('investorProfileId') investorProfileId: number,
    @Param('companyId') companyId: number,
  ) {
    return this.matchmakingService.connectWithCompany(
      investorProfileId,
      companyId,
    );
  }

  @Get('interested/:investorProfileId')
  getInterestingCompanies(
    @Param('investorProfileId') investorProfileId: number,
  ) {
    return this.matchmakingService.getInterestingCompanies(investorProfileId);
  }

  @Get('connected/:investorProfileId')
  getConnectedCompanies(@Param('investorProfileId') investorProfileId: number) {
    return this.matchmakingService.getConnectedCompanies(investorProfileId);
  }

  @Get('investors/interested/:companyId')
  getInterestedInvestors(@Param('companyId') companyId: number) {
    return this.matchmakingService.getInterestedInvestors(companyId);
  }

  @Get('investors/connected/:companyId')
  getConnectedInvestors(@Param('companyId') companyId: number) {
    return this.matchmakingService.getConnectedInvestors(companyId);
  }

  @Post('decline/:investorProfileId/:companyId')
  markAsDeclined(
    @Param('investorProfileId') investorProfileId: number,
    @Param('companyId') companyId: number,
  ) {
    return this.matchmakingService.markAsDeclined(investorProfileId, companyId);
  }

  @Post('disconnect/:investorProfileId/:companyId')
  disconnectFromCompany(
    @Param('investorProfileId') investorProfileId: number,
    @Param('companyId') companyId: number,
  ) {
    return this.matchmakingService.disconnectFromCompany(
      investorProfileId,
      companyId,
    );
  }

  @Get('declined/:investorProfileId')
  getDeclinedCompanies(@Param('investorProfileId') investorProfileId: number) {
    return this.matchmakingService.getDeclinedCompanies(investorProfileId);
  }

  @Post('search-companies')
  searchCompanies(@Body() searchDto: FilterCompanyDto) {
    return this.matchmakingService.searchCompanies(searchDto);
  }
}
