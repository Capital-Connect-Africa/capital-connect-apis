import { Controller, Get, Post, Body, Param, Delete, UseGuards, BadRequestException, Put, HttpCode, Query, HttpStatus, NotFoundException } from '@nestjs/common';
import { SubsectionService } from './subsection.service';
import { CreateSubsectionDto } from './dto/create-subsection.dto';
import { UpdateSubsectionDto } from './dto/update-subsection.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { SectionService } from 'src/section/section.service';
import { QuestionService } from 'src/question/question.service';
import { SubSection } from './entities/subsection.entity';

@Controller('subsections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubsectionController {
  constructor(
    private readonly subsectionService: SubsectionService,
    private readonly sectionService: SectionService,
    private readonly questionService: QuestionService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createSubsectionDto: CreateSubsectionDto) {
    try {
      await this.sectionService.findOne(createSubsectionDto.sectionId);
      const subsection = new SubSection();
      subsection.name = createSubsectionDto.name;
      subsection.description = createSubsectionDto.description;
      subsection.section = { id: createSubsectionDto.sectionId } as any;
      return await this.subsectionService.create(subsection);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Subsection must be associated with an existing section.');
      }
      throwInternalServer(error)
    }
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number){
    try {
      const subsections = await this.subsectionService.findAll(page, limit);
      return subsections;
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.subsectionService.findOne(+id);
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateSubsectionDto: UpdateSubsectionDto) {
    try {
      await this.subsectionService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Subsection with id ${id} not found`);
      }
      throwInternalServer(error)
    }

    try {
      if (updateSubsectionDto.sectionId) {
        await this.sectionService.findOne(updateSubsectionDto.sectionId);
      }

      const subSection = await this.subsectionService.update(+id, updateSubsectionDto);
      return subSection;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Sub section must be associated with an existing section.');
      }
      throwInternalServer(error)
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    try {
      this.subsectionService.remove(+id);
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Get(':id/questions')
  async getQuestionsWithAnswers(@Param('id') id: string) {
    try {
      const subsection = await this.subsectionService.findOne(+id);
      const questions = await this.questionService.findQuestionsBySubsectionId(subsection.id);
      return questions;
    } catch (error) {
      throwInternalServer(error);
    }
  }
}
