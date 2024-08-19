import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { Company } from '../company/entities/company.entity';
import { InvestorProfile } from '../investor-profile/entities/investor-profile.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { DeclineReason } from './entities/declineReasons.entity';
import { CreateDeclineReasonDto } from './dto/create-decline-reason.dto';

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
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.matchmakingService.getInterestingCompanies(investorProfileId, page, limit);
  }

  @Get('connected/:investorProfileId')
  getConnectedCompanies(
    @Param('investorProfileId') investorProfileId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.matchmakingService.getConnectedCompanies(investorProfileId, page, limit);
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
  getDeclinedCompanies(
    @Param('investorProfileId') investorProfileId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.matchmakingService.getDeclinedCompanies(investorProfileId, page, limit);
  }

  @Post(':id/decline-reasons')
  @Roles(Role.Investor)
  addDeclineReason(
    @Param('id') id: number,
    @Body() createDeclineReasonDto: CreateDeclineReasonDto) {
    const declineReason = new DeclineReason();
    declineReason.reason = createDeclineReasonDto.reason;

    return this.matchmakingService.addDeclineReason(id, declineReason);
  }
}
