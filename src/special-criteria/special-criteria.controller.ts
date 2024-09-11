import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SpecialCriteriaService } from './special-criteria.service';
import { CreateSpecialCriterionDto } from './dto/create-special-criterion.dto';
import { UpdateSpecialCriterionDto } from './dto/update-special-criterion.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { AddQuestionDto } from './dto/add-question.dto';

@Controller('special-criteria')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpecialCriteriaController {
  constructor(
    private readonly specialCriteriaService: SpecialCriteriaService,
  ) {}

  @Post()
  @Roles(Role.Admin, Role.Advisor, Role.Investor)
  create(@Body() createSpecialCriterionDto: CreateSpecialCriterionDto) {
    try {
      return this.specialCriteriaService.create(createSpecialCriterionDto);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Post('add-questions')
  async addQuestions(@Body() dto: AddQuestionDto) {
    return this.specialCriteriaService.addQuestionsToSpecialCriteria(dto);
  }

  @Post('remove-questions')
  async removeQuestions(@Body() dto: AddQuestionDto) {
    return this.specialCriteriaService.removeQuestionsToSpecialCriteria(dto);
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    try {
      return await this.specialCriteriaService.findAll(page, limit);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.specialCriteriaService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throwInternalServer(error);
    }
  }

  @Get('investor-profile/:investorProfileId')
  async findByInvestorProfileId(
    @Param('investorProfileId') investorProfileId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.specialCriteriaService.findByInvestorProfileId(
      investorProfileId,
      page,
      limit,
    );
  }

  @Get('company/:companyId')
  async findByCompanyId(
    @Param('companyId') companyId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.specialCriteriaService.findByCompanyId(companyId, page, limit);
  }

  @Get('criteria/:specialCriteriaId')
  async getCompaniesByCriteria(
    @Param('specialCriteriaId') specialCriteriaId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.specialCriteriaService.findCompaniesThatAnsweredCriteria(specialCriteriaId, page, limit);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Advisor, Role.Investor)
  async update(
    @Param('id') id: string,
    @Body() updateSpecialCriterionDto: UpdateSpecialCriterionDto,
  ) {
    try {
      await this.specialCriteriaService.findOne(+id);
      return await this.specialCriteriaService.update(
        +id,
        updateSpecialCriterionDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(
          `Special criteria with id ${id} not found`,
        );
      }
      throwInternalServer(error);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Advisor, Role.Investor)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.specialCriteriaService.remove(+id);
    } catch (error) {
      throwInternalServer(error);
    }
  }
}
