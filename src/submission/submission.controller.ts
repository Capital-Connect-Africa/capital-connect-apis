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
  Request,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { SubmissionService } from "./submission.service";
import { CreateMultipleSubmissionsDto, CreateSubmissionDto } from "./dto/create-submission.dto";
import { Submission } from "./entities/submission.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/auth/role.enum";
import throwInternalServer from "src/shared/utils/exceptions.util";
import { SectionService } from "src/section/section.service";
import { UpdateSubmissionDto } from "./dto/update-submission.dto";
import { User } from "../users/entities/user.entity";
import { Question } from "../question/entities/question.entity";
import { Answer } from "../answer/entities/answer.entity";
import { SpecialCriteriaService } from "../special-criteria/special-criteria.service";

@Controller('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmissionController {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly sectionService: SectionService,
    private readonly specialCriteriaService: SpecialCriteriaService,
  ) {}

  @Post()
  @Roles(Role.User, Role.Investor)
  async create(
    @Request() req,
    @Body() createSubmissionDto: CreateSubmissionDto,
  ): Promise<Submission> {
    try {
      if (createSubmissionDto.userId !== req.user.id) {
        throw new UnauthorizedException(
          'You are not authorized to respond on behalf of this user.',
        );
      }
      const check = await this.submissionService.findSubmission(
        createSubmissionDto.userId,
        createSubmissionDto.questionId,
        createSubmissionDto.answerId,
      );
      if (check) {
        check.text = createSubmissionDto.text;
        return this.submissionService.update(check.id, check);
      } else {
        // Create a new submission
        const submission = new Submission();
        submission.user = { id: createSubmissionDto.userId } as any; // Simplified for example purposes
        submission.question = { id: createSubmissionDto.questionId } as any;
        submission.answer = { id: createSubmissionDto.answerId } as any;
        submission.text = createSubmissionDto.text;
        return this.submissionService.create(submission);
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throwInternalServer(error);
    }
  }

  @Post('bulk')
  @Roles(Role.User, Role.Investor)
  async createMultiple(
    @Request() req,
    @Body() createMultipleSubmissionsDto: CreateMultipleSubmissionsDto,
  ): Promise<Submission[]> {
    try {
      const submissionPromises = createMultipleSubmissionsDto.submissions.map(
        async (dto) => {
          if (dto.userId !== req.user.id) {
            throw new UnauthorizedException(
              'You are not authorized to respond on behalf of this user.',
            );
          }

          const check = await this.submissionService.findSubmission(
            dto.userId,
            dto.questionId,
            dto.answerId,
          );

          if (check) {
            check.text = dto.text;
            return this.submissionService.update(check.id, check);
          } else {
            const submission = new Submission();
            submission.user = { id: dto.userId } as User;
            submission.question = { id: dto.questionId } as Question;
            submission.answer = { id: dto.answerId } as Answer;
            submission.text = dto.text;

            return this.submissionService.create(submission);
          }
        },
      );

      const submissions = await Promise.all(submissionPromises);
      return submissions;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throwInternalServer(error);
    }
  }

  @Put(':id')
  @Roles(Role.User, Role.Investor)
  async update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    try {
      const submission = await this.submissionService.findOne(+id);
      if (!submission) {
        throw new NotFoundException(`Submission with id ${id} not found`);
      }
      const updatedSubmission = await this.submissionService.update(
        +id,
        updateSubmissionDto,
      );
      return updatedSubmission;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Submission with id ${id} not found`);
      }
      throwInternalServer(error);
    }
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<Submission[]> {
    try {
      return await this.submissionService.findByUser(+userId);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get('by-question-ids')
  async getSubmissionsByQuestionIds(
    @Query('questionIds') questionIds: string, // Expecting comma-separated question IDs
    @Query('userId') userId: number,
  ): Promise<Submission[]> {
    const questionIdsArray = questionIds.split(',').map(Number);
    return this.submissionService.findAllByQuestionIds(
      questionIdsArray,
      userId,
    );
  }

  @Get('find-users')
  async findUsersByQuestionIds(
    @Query('questionIds') questionIds: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<User[]> {
    const questionIdsArray = questionIds.split(',').map(Number);
    return this.submissionService.findUsersByQuestionIds(
      questionIdsArray,
      page,
      limit,
    );
  }

  @Get('by-special-criteria/:specialCriteriaId')
  async getSubmissionsBySpecialCriteria(
    @Param('specialCriteriaId') specialCriteriaId: number,
    @Query('userId') userId: number,
  ): Promise<Submission[]> {
    const specialCriterion =
      await this.specialCriteriaService.findOne(specialCriteriaId);
    if (!specialCriterion) {
      throw new NotFoundException(
        `Special criteria with id ${specialCriteriaId} not found`,
      );
    }
    const questionIdsArray = specialCriterion.questions.map(
      (question) => question.id,
    );
    return this.submissionService.findAllByQuestionIds(
      questionIdsArray,
      userId,
    );
  }

  @Get('by-question/:questionId')
  async findOneByQuestionId(
    @Param('questionId') questionId: number,
    @Query('userId') userId: number,
  ): Promise<Submission> {
    const submission = await this.submissionService.findOneByQuestionId(
      questionId,
      userId,
    );

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }

  @Get('user/:userId/section/:sectionId')
  async findByUserPerSection(
    @Param('userId') userId: string,
    @Param('sectionId') sectionId: string,
  ): Promise<Submission[]> {
    try {
      return await this.submissionService.findByUserPerSection(
        +userId,
        +sectionId,
      );
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get('user/:userId/score')
  async calculateScore(
    @Param('userId') userId: string,
  ): Promise<{ score: number }> {
    try {
      const score = await this.submissionService.calculateScore(+userId);
      return { score };
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get('user/:userId/score/:sectionId')
  async calculateScorePerSection(
    @Param('userId') userId: number,
    @Param('sectionId') sectionId: number,
  ): Promise<{ score: number }> {
    try {
      return await this.submissionService.calculateScorePerSection(
        userId,
        sectionId,
      );
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get('user/:userId/criterion-score/:specialCriterionId')
  async calculateScorePerCriterion(
    @Param('userId') userId: number,
    @Param('specialCriterionId') specialCriterionId: number,
  ): Promise<{ score: number }> {
    try {
      return await this.submissionService.calculateScorePerSpecialCriterion(
        userId,
        specialCriterionId,
      );
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get('user/:userId/scores')
  async calculateScores(@Param('userId') userId: string): Promise<any[]> {
    try {
      const sections = await this.sectionService.findAll();
      const scores = [];
      for (const section of sections) {
        const score = await this.submissionService.calculateScorePerSection(
          +userId,
          section.id,
        );

        scores.push({ ...section, ...score });
      }
      return scores;
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Param('id') id: string) {
    try {
      const user = req.user;
      const submission = await this.submissionService.findOne(+id);
      if (!submission) {
        throw new NotFoundException(`Submission with id ${id} not found`);
      }
      const owner = submission.user;

      if (user.roles.includes('admin')) {
        await this.submissionService.remove(+id);
        return;
      }

      if (owner.id !== user.id) {
        throw new UnauthorizedException(
          `You are not authorized to delete this user's responses.`,
        );
      }
      await this.submissionService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) return;
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throwInternalServer(error);
    }
  }
}
