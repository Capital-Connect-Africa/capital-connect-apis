import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  Response,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { MatchmakingService } from './matchmaking.service';
import { Company } from '../company/entities/company.entity';
import { InvestorProfile } from '../investor-profile/entities/investor-profile.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FilterCompanyDto } from '../company/dto/filter-company.dto';
import { DeclineReason } from './entities/declineReasons.entity';
import { CreateDeclineReasonDto } from './dto/create-decline-reason.dto';
import { DeclineReasonsDto } from './dto/decline-reasons.dto';
import throwInternalServer from '../shared/utils/exceptions.util';

@UseGuards(JwtAuthGuard)
@Controller('matchmaking')
export class MatchmakingController {
  constructor(private matchmakingService: MatchmakingService) {}

  @Roles(Role.Investor)
  @Get('companies')
  async getMatchingCompanies(@Request() req): Promise<Company[]> {
    try {
      return this.matchmakingService.getMatchingCompanies(req.user.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throwInternalServer(error);
    }
  }

  @Roles(Role.Advisor, Role.Admin)
  @Get('companies/:investorId')
  async getMatchingCompaniesByInvestorId(
    @Param('investorId') investorId: number,
  ): Promise<Company[]> {
    try {
      return await this.matchmakingService.getMatchingCompaniesByInvestorProfileId(
        investorId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throwInternalServer(error);
    }
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
    return this.matchmakingService.getInterestingCompanies(
      investorProfileId,
      page,
      limit,
    );
  }

  @Get('connected/:investorProfileId')
  getConnectedCompanies(
    @Param('investorProfileId') investorProfileId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.matchmakingService.getConnectedCompanies(
      investorProfileId,
      page,
      limit,
    );
  }

  @Get('investors/interested/:companyId')
  getInterestedInvestors(
    @Param('companyId') companyId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.matchmakingService.getInterestedInvestors(
      companyId,
      page,
      limit,
    );
  }

  @Get('investors/connected/:companyId')
  getConnectedInvestors(
    @Param('companyId') companyId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.matchmakingService.getConnectedInvestors(
      companyId,
      page,
      limit,
    );
  }

  @Post('decline/:investorProfileId/:companyId')
  markAsDeclined(
    @Param('investorProfileId') investorProfileId: number,
    @Param('companyId') companyId: number,
    @Body() declineReasons: DeclineReasonsDto,
  ) {
    return this.matchmakingService.markAsDeclined(
      investorProfileId,
      companyId,
      declineReasons.declineReasons,
    );
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
    return this.matchmakingService.getDeclinedCompanies(
      investorProfileId,
      page,
      limit,
    );
  }

  @Post(':id/decline-reasons')
  @Roles(Role.Investor)
  addDeclineReason(
    @Param('id') id: number,
    @Body() createDeclineReasonDto: CreateDeclineReasonDto,
  ) {
    const declineReason = new DeclineReason();
    declineReason.reason = createDeclineReasonDto.reason;

    return this.matchmakingService.addDeclineReason(id, declineReason);
  }

  @Post('search-companies')
  searchCompanies(@Body() searchDto: FilterCompanyDto) {
    return this.matchmakingService.searchCompanies(searchDto);
  }

  @Get('download-csv/:investorProfileId')
  async downloadMatchMakingCSV(
    @Response() res: Res,
    @Param('investorProfileId') investorProfileId: number,
    @Query('status') status: string,
  ) {
    const csvStream = await this.matchmakingService.generateMatchMakingCSV(
      investorProfileId,
      status,
    );

    res.set('Content-Type', 'text/csv');
    res.set(
      'Content-Disposition',
      `attachment; filename=matchmaking-${Date.now()}.csv`,
    );

    csvStream.pipe(res);
  }
}
