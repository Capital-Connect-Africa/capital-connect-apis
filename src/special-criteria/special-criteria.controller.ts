import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, NotFoundException, BadRequestException, Put, HttpCode, HttpStatus } from '@nestjs/common';
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
  constructor(private readonly specialCriteriaService: SpecialCriteriaService) {}

  @Post()
  @Roles(Role.Admin)
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

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    try {
      const special = await this.specialCriteriaService.findAll(page, limit);
      return special;
    } catch (error) {
      throwInternalServer(error)
    }    
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.specialCriteriaService.findOne(+id);
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateSpecialCriterionDto: UpdateSpecialCriterionDto) {
    try {
      await this.specialCriteriaService.findOne(+id);
      const special = await this.specialCriteriaService.update(+id, updateSpecialCriterionDto);
      return special;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Special criteria with id ${id} not found`);
      }
      throwInternalServer(error);      
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.specialCriteriaService.remove(+id);
    } catch (error) {
      throwInternalServer(error);
    }
  }
}
