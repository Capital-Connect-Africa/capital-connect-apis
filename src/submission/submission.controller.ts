import { Controller, Post, Body, Get, Param, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto, CreateMultipleSubmissionsDto } from './dto/create-submission.dto';
import { Submission } from './entities/submission.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import throwInternalServer from 'src/shared/utils/exceptions.util';

@Controller('submissions')
@Controller('answers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @Roles(Role.User)
  async create(@Request() req, @Body() createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    try {
      if (createSubmissionDto.userId !== req.user.id) {
        throw new UnauthorizedException("You are not authorized to respond on behalf of this user.");
      }
      const check = await this.submissionService.findSubmission(
        createSubmissionDto.userId,
        createSubmissionDto.questionId,
        createSubmissionDto.answerId
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
      throwInternalServer(error)
    }
  }

  @Post('bulk')
  @Roles(Role.User)
  async createMultiple(@Request() req, @Body() createMultipleSubmissionsDto: CreateMultipleSubmissionsDto): Promise<Submission[]> {
    try {
    const submissions = createMultipleSubmissionsDto.submissions.map( async (dto)=> {
      if (dto.userId !== req.user.id) {
        throw new UnauthorizedException("You are not authorized to respond on behalf of this user.");
      }
      const check = await this.submissionService.findSubmission(
        dto.userId,
        dto.questionId,
        dto.answerId
      );
      if (check) {
        check.text = dto.text;
        return this.submissionService.update(check.id, check);
      } else {
        const submission = new Submission();
        submission.user = { id: dto.userId } as any; // Simplified for example purposes
        submission.question = { id: dto.questionId } as any;
        submission.answer = { id: dto.answerId } as any;
        submission.text = dto.text;
        return this.submissionService.createMultiple(submissions);
      } 
    });
    const multiples = await Promise.all(submissions);
    return multiples;

  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throwInternalServer(error)
  }
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<Submission[]> {
    try {
      return this.submissionService.findByUser(+userId);
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Get('user/:userId/score')
  async calculateScore(@Param('userId') userId: string): Promise<{ score: number }> {
    try {
      const score = await this.submissionService.calculateScore(+userId);
      return { score };
    } catch (error) {
      throwInternalServer(error)
    }
  }
}
