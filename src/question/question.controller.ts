import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, HttpCode, HttpStatus, NotFoundException, BadRequestException, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { SubsectionService } from 'src/subsection/subsection.service';

@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly subsectionService: SubsectionService
  ) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      await this.subsectionService.findOne(createQuestionDto.subSectionId);
      return this.questionService.create(createQuestionDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Question must be associated with an existing subsection.');
      }
      throwInternalServer(error)
    }
  }

  @Get()
  findAll(@Query('page') page: number = 1, @Query('count') limit: number = 10) {
    try {
      return this.questionService.findAll(page, limit);
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.questionService.findOne(+id);
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    try {
      await this.questionService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Question with id ${id} not found`);
      }
      throwInternalServer(error)
    }

    try {
      if (updateQuestionDto.subSectionId) {
        await this.subsectionService.findOne(updateQuestionDto.subSectionId);
      }

      const question = await this.questionService.update(+id, updateQuestionDto);
      return question;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Question must be associated with an existing sub section.');
      }
      throwInternalServer(error)
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    try {
      return this.questionService.remove(+id);
    } catch (error) {
      throwInternalServer(error)
    }
  }
}
