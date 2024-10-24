import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InvestorProfileService } from './investor-profile.service';
import { CreateInvestorProfileDto } from './dto/create-investor-profile.dto';
import { UpdateInvestorProfileDto } from './dto/update-investor-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { FilterInvestorProfilesDto } from './dto/filter-investor-profile.dto';
import { InvestorProfile } from './entities/investor-profile.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('investor-profiles')
export class InvestorProfileController {
  constructor(
    private readonly investorProfileService: InvestorProfileService,
  ) {}

  @Roles(Role.Investor)
  @Post()
  async create(
    @Request() req,
    @Body() createInvestorProfileDto: CreateInvestorProfileDto,
  ) {
    try {
      const user = req.user;
      const investorProfile = await this.investorProfileService.findOneByUserId(
        user.id,
      );
      if (investorProfile) {
        throw new BadRequestException(
          'Investor profile already exists for this user.',
        );
      }
      if (!user.roles.includes('investor')) {
        throw new BadRequestException(
          'User not allowed to create investor profile.',
        );
      }
      return this.investorProfileService.create(createInvestorProfileDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @Roles(Role.Admin, Role.Investor, Role.Advisor)
  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.investorProfileService.findAll(page, limit);
  }

  @Roles(Role.Admin, Role.Investor, Role.Advisor, Role.User, Role.ContactPerson)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    try {
      const investorProfile = await this.investorProfileService.findOne(+id);

      if (!investorProfile) {
        throw new NotFoundException('Investor profile not found');
      }

      const user = req.user;
      if (
        user.roles.includes('investor') &&
        investorProfile.investor.id !== user.id
      ) {
        throw new BadRequestException(
          'User not allowed to view investor profile.',
        );
      }
      return investorProfile;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @Roles(Role.Admin, Role.Investor, Role.Advisor)
  @Get('by-user/:userId')
  async findOneByUserId(@Request() req, @Param('userId') userId: string) {
    try {
      const investorProfile =
        await this.investorProfileService.findOneByUserId(+userId);

      if (!investorProfile) {
        throw new NotFoundException('Investor profile not found');
      }
      const user = req.user;
      if (
        user.roles.includes('investor') &&
        investorProfile.investor.id !== user.id
      ) {
        throw new BadRequestException(
          'User not allowed to view investor profile.',
        );
      }
      return investorProfile;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throwInternalServer(error);
    }
  }
  @Roles(Role.Admin, Role.Investor, Role.Advisor, Role.ContactPerson)
  @Get('contact/:contactPersonId')
  async getInvestorProfileByContactPersonId(
    @Param('contactPersonId') contactPersonId: number,
  ): Promise<InvestorProfile> {
    return await this.investorProfileService.findOneByContactPersonId(contactPersonId);
  }
  @Roles(Role.Admin, Role.Investor, Role.Advisor, Role.ContactPerson)
  @Get('contacts/:userId')
  async getProfileByContactUserId(
    @Param('userId') userId: number,
  ): Promise<InvestorProfile> {
    return await this.investorProfileService.findOneByContactUserId(userId);
  }

  @Roles(Role.Admin, Role.Investor)
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateInvestorProfileDto: UpdateInvestorProfileDto,
  ) {
    try {
      const investorProfile = await this.investorProfileService.findOne(+id);
      const user = req.user;
      if (
        user.roles.includes('investor') &&
        investorProfile.investor.id !== user.id
      ) {
        throw new BadRequestException(
          'User not allowed to update investor profile.',
        );
      }
      return await this.investorProfileService.update(
        +id,
        updateInvestorProfileDto,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investorProfileService.remove(+id);
  }

  @Post('filter')
  filter(
    @Body() filterDto: FilterInvestorProfilesDto,
  ): Promise<InvestorProfile[]> {
    return this.investorProfileService.filter(filterDto);
  }

  @Post('filter/by-or')
  filterByOr(
    @Body() filterDto: FilterInvestorProfilesDto,
  ): Promise<InvestorProfile[]> {
    return this.investorProfileService.filterByOr(filterDto);
  }
}
