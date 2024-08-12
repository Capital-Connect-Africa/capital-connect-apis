import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Request,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { FilterCompanyDto } from './dto/filter-company.dto';
import { Company } from './entities/company.entity';

@UseGuards(JwtAuthGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Request() req, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(req.user.id, createCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    try {
      const companies = await this.companyService.findAll(page, limit);
      return companies;
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      const company = this.companyService.findOne(+id);
      if (company) {
        return company;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @Get('owner/:id')
  findOneByOwnerId(@Param('id') id: string) {
    try {
      const company = this.companyService.findOneByOwnerId(+id);
      if (company) {
        return company;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      return this.companyService.update(+id, updateCompanyDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    try {
      this.companyService.remove(+id);
      return;
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Investor)
  @Get('/invesetor-matches/:id')
  async getInvestorMatches(@Param('id') id: string) {
    try {
      const match = await this.companyService.getMatchedBusinesses(+id);
      return match;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Get('/business-matches/:id')
  getBusinessMatches(@Param('id') id: string) {
    try {
      const match = this.companyService.getMatchedInvestors(+id);
      if (match) {
        return match;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Advisor, Role.Admin, Role.Investor)
  @Post('filter')
  async filterCompanies(
    @Body() filterDto: FilterCompanyDto,
  ): Promise<Company[]> {
    return this.companyService.filterCompanies(filterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Advisor, Role.Admin, Role.Investor)
  @Post('filter/by-or')
  async filterCompaniesByOr(
    @Body() filterDto: FilterCompanyDto,
  ): Promise<Company[]> {
    return this.companyService.filterCompaniesByOr(filterDto);
  }
}
