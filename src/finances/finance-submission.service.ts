import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FinancialQuestions } from "./entities/finance.entity";
import { User } from "src/users/entities/user.entity";
import { CreateFinanceSubmissionDto } from "./dto/create-finance-submission.dto";
import { UpdateFinanceSubmissionDto } from "./dto/update-finance-submission.dto";
import { FinanceSubmission } from "./entities/finance_submission.entity";
import { FinanceStatus } from "./finance.enum";

@Injectable()
export class FinanceSubmissionService{
      constructor(
    @InjectRepository(FinanceSubmission)
    private readonly financeSubmissionRepository: Repository<FinanceSubmission>,
    @InjectRepository(FinancialQuestions)
    private readonly financialQuestionsRepository: Repository<FinancialQuestions>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createSubmission(createFinanceSubmissionDto: CreateFinanceSubmissionDto): 
  Promise<FinanceSubmission> {
    const existingSubmission = await this.financeSubmissionRepository.findOne({
      where: { 
        userId: {id: createFinanceSubmissionDto.userId}, 
        question: { id: createFinanceSubmissionDto.questionId }, 
        year: createFinanceSubmissionDto.year,
      },
    });
  
    if (existingSubmission) {
      throw new NotFoundException('This submission already exists for the given question and year.');
    }
  
    // Retrieve the related question entity
    const question = await this.financialQuestionsRepository.findOne({ 
      where: { id: createFinanceSubmissionDto.questionId} 
    });
    if (!question) {
      throw new NotFoundException('Question not found.');
    }
  
    // Retrieve the related user entity
    const user = await this.userRepository.findOne({ 
      where: { id: createFinanceSubmissionDto.userId }
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
  
    const financeSubmission = this.financeSubmissionRepository.create({
      ...createFinanceSubmissionDto,
      question,
      userId: user,
      status: FinanceStatus.PENDING, // Default status
    });
  
    return this.financeSubmissionRepository.save(financeSubmission);
  }  

  async findAllSubmissions(): Promise<FinanceSubmission[]> {
    try {
      const submissions = await this.financeSubmissionRepository.find({
        relations: ['question', 'userId'],
      });

      if (!submissions.length) {
        throw new NotFoundException('No financial submissions found.');
      }

      return submissions;
    } catch (error) {
      throw new Error('An error occurred while fetching financial submissions.');
    }
  }

  async findAllSubmissionsByUserId(userId: number): 
  Promise<FinanceSubmission[]> {
      const submissions = await this.financeSubmissionRepository.find({
        where: { userId: { id: userId } },
        relations: ['question'],
      });
  
      if (!submissions.length) {
        throw new NotFoundException(`No financial submissions found for user with id ${userId}.`);
      }
  
      return submissions;
  }  

  async findOneSubmission(id: number): Promise<FinanceSubmission> {
      const submission = await this.financeSubmissionRepository.findOne({ 
        where: { id },
        relations: ['question'],      
      });
      if (!submission) {
        throw new NotFoundException(`Financial submission with id ${id} not found.`);
      }

      return submission;
  }

  async updateSubmission(id: number, updateFinanceSubmissionDto: UpdateFinanceSubmissionDto): 
  Promise<FinanceSubmission> {
    const { year, amount } = updateFinanceSubmissionDto;
    const updates = {};

    if (year) updates['year'] = year;
    if (amount) updates['amount'] = amount;
    if (Object.keys(updates).length > 0) {
      await this.financeSubmissionRepository.update(id, updates);
    }

    return this.financeSubmissionRepository.findOne({ where: { id } });
  }

  async removeSubmission(id: number): Promise<void> {
    const submission = await this.financeSubmissionRepository.findOne({ where: { id } });
    if (!submission) {
      throw new NotFoundException(`Financial submission with id ${id} not found.`);
    }
    await this.financeSubmissionRepository.delete(id);
  }
}