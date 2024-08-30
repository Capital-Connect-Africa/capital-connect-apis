import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { Question } from 'src/question/entities/question.entity';
import { SubSection } from 'src/subsection/entities/subsection.entity';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    @InjectRepository(SubSection)
    private subSectionsRepository: Repository<SubSection>,
  ) {}

  async getSubmissionsGroupedBySubsections(userId: number): Promise<any> {
    const subsections = await this.subSectionsRepository
      .createQueryBuilder('subSection')
      .leftJoinAndSelect('subSection.questions', 'question')
      .leftJoinAndSelect(
        'question.submissions',
        'submission',
        'submission.userId = :userId',
        { userId },
      )
      .getMany();

    return subsections.map((subSection) => ({
      sub_section_id: subSection.id,
      sub_section_name: subSection.name,
      questions: subSection.questions.map((question) => question.id),
    }));
  }

  async create(submission: Submission): Promise<Submission> {
    const sub = await this.submissionRepository.save(submission);
    return this.submissionRepository.findOne({
      where: { id: sub.id },
      relations: ['user', 'question', 'answer'],
    });
  }

  async createMultiple(submissions: Submission[]): Promise<Submission[]> {
    return this.submissionRepository.save(submissions);
  }

  async findSubmission(userId: number, questionId: number, answerId: number) {
    return await this.submissionRepository.findOne({
      where: {
        user: { id: userId },
        question: { id: questionId },
        answer: { id: answerId },
      },
      relations: ['user', 'question', 'answer'],
    });
  }

  async update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    const { answerId, text } = updateSubmissionDto;
    const updates = {};
    if (answerId) updates['answerId'] = answerId;
    if (text) updates['text'] = text;
    if (Object.keys(updates).length > 0)
      await this.submissionRepository.update(id, updates);
    return this.submissionRepository.findOne({
      where: { id },
      relations: ['user', 'question', 'answer'],
    });
  }

  async findOne(id: number): Promise<Submission> {
    const submission = await this.submissionRepository.findOne({
      where: { id },
      relations: ['user', 'question', 'answer'],
    });
    if (!submission) {
      throw new NotFoundException(`Submission with id ${id} not found`);
    }
    return submission;
  }

  async findAll(): Promise<Submission[]> {
    return this.submissionRepository.find({
      relations: ['user', 'question', 'answer'],
    });
  }

  async findAllByQuestionIds(
    questionIds: number[],
    userId: number,
  ): Promise<Submission[]> {
    const submissions = this.submissionRepository.find({
      where: { user: { id: userId } },
      relations: ['question', 'answer'],
    });
    return submissions.then((submissions) =>
      submissions.filter((submission) =>
        questionIds.includes(submission.question.id),
      ),
    );
  }

  async findOneByQuestionId(
    questionId: number,
    userId: number,
  ): Promise<Submission> {
    const submission = await this.submissionRepository.findOne({
      where: { user: { id: userId }, question: { id: questionId } },
      relations: ['question', 'answer'],
    });
    return submission;
  }

  async findByUser(userId: number): Promise<Submission[]> {
    return this.submissionRepository.find({
      where: { user: { id: userId } },
      relations: ['question', 'answer', 'question.subSection'],
    });
  }

  async findByUserPerSection(
    userId: number,
    sectionId: number,
  ): Promise<Submission[]> {
    const subSections = await this.subSectionsRepository.find({
      where: { section: { id: sectionId } },
      select: ['id'],
    });

    const subSectionIds = subSections.map((subSection) => subSection.id);

    const submissions = await this.findByUser(userId);
    return submissions.filter((submission) => {
      if (subSectionIds.includes(submission.question.subSection.id)) {
        return submission;
      }
    });
  }

  async findQuestionsBySubsectionId(subSectionId: number): Promise<Question[]> {
    return this.questionsRepository.find({
      where: { subSection: { id: subSectionId } },
      relations: ['answers'],
    });
  }

  async findQuestionsByIds(questionIds: number[]): Promise<Question[]> {
    return this.questionsRepository.find({
      where: { id: In(questionIds) },
      relations: ['answers'],
    });
  }

  async calculateScore(userId: number): Promise<any> {
    const submissions = await this.getSubmissionsGroupedBySubsections(userId);
    const subSectionsScores = [];
    for (const subSection of submissions) {
      if (subSection.questions.length > 0) {
        const questions = await this.findAllByQuestionIds(
          subSection.questions,
          userId,
        );
        const score = questions.reduce(
          (total, submission) => total + submission.answer.weight,
          0,
        );
        const rawQuestions = await this.findQuestionsBySubsectionId(
          subSection.sub_section_id,
        );
        const targetScore = rawQuestions.reduce(
          (total, question) =>
            total + question.answers.reduce((t, ans) => t + ans.weight, 0),
          0,
        );
        const percentageScore = (score / targetScore) * 100;
        subSectionsScores.push({
          subSectionId: subSection.sub_section_id,
          subSectionName: subSection.sub_section_name,
          score,
          targetScore,
          percentageScore: Math.round(percentageScore),
        });
      }
    }
    return subSectionsScores;
  }

  async findSubsections(id: number): Promise<SubSection[]> {
    return this.subSectionsRepository.find({
      where: { section: { id } },
      relations: ['questions'],
    });
  }

  async calculateScorePerSection(
    userId: number,
    sectionId: number,
  ): Promise<any> {
    const subSections = await this.findSubsections(sectionId);
    const sectionQuestionIds = subSections
      .map((subSection) => subSection.questions.map((question) => question.id))
      .flat();
    const questions = await this.findAllByQuestionIds(
      sectionQuestionIds,
      userId,
    );
    const score = questions.reduce(
      (total, submission) => total + submission.answer.weight,
      0,
    );
    const rawQuestions = await this.findQuestionsByIds(sectionQuestionIds);

    // const targetScore = rawQuestions.reduce(
    //   (total, question) =>
    //     total + question.answers.reduce((t, ans) => t + ans.weight, 0),
    //   0,
    // );

    const targetScore = rawQuestions.reduce(
      (total, question) => total + this.getMaxWeight(question),
      0,
    );

    const percentageScore = (score / targetScore) * 100;
    return {
      score,
      targetScore,
      percentageScore: percentageScore ? Math.round(percentageScore) : 0,
    };
  }

  remove(id: number) {
    this.submissionRepository.delete(id);
  }

  private getMaxWeight(question: Question) {
    const weights = question.answers.map((ans) => ans.weight);
    console.log(weights);
    const max = weights.length > 0 ? Math.max(...weights) : 0;
    console.log(max);
    return max;
  }
}
