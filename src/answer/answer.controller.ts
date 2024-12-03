import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Query, BadRequestException, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { QuestionService } from 'src/question/question.service';
import { Answer } from './entities/answer.entity';

@Controller('answers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService
  ) {}

  @Post()
  @Roles(Role.Admin, Role.Advisor, Role.Investor, Role.ContactPerson)
  async create(@Body() createAnswerDto: CreateAnswerDto) {
    const { text, weight, questionId, recommendation } = createAnswerDto;
    try {
      await this.questionService.findOne(createAnswerDto.questionId);
      const answer = new Answer();
      answer.text = text;
      answer.weight = weight;
      answer.recommendation = recommendation;
      answer.question = { id: questionId } as any;
      return this.answerService.create(answer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('An answer must be associated with an existing question.');
      }
      throwInternalServer(error)
    }
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    try {
      return this.answerService.findAll(page, limit);
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.answerService.findOne(+id);
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Investor, Role.Advisor, Role.ContactPerson)
  async update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
    try {
      await this.answerService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Answer with id ${id} not found`);
      }
      throwInternalServer(error)
    }

    try {
      if (updateAnswerDto.questionId) {
        await this.questionService.findOne(updateAnswerDto.questionId);
      }

      const answer = await this.answerService.update(+id, updateAnswerDto);
      return answer;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw new BadRequestException('An answer must be associated with an existing question.');
      }
      throwInternalServer(error)
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    try {
      this.answerService.remove(+id);
      return 
    } catch (error) {
      throwInternalServer(error)
    }
  }
}
