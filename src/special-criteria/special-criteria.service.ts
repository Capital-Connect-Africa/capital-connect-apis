import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecialCriterionDto } from './dto/create-special-criterion.dto';
import { UpdateSpecialCriterionDto } from './dto/update-special-criterion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialCriterion } from './entities/special-criterion.entity';
import { In, Repository } from 'typeorm';
import { AddQuestionDto } from './dto/add-question.dto';
import { Question } from 'src/question/entities/question.entity';
import { InvestorProfile } from '../investor-profile/entities/investor-profile.entity';
import { SpecialCriterionQuestion } from './entities/special-criterion-questions.entity';
import { Matchmaking } from '../matchmaking/entities/matchmaking.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class SpecialCriteriaService {
  constructor(
    @InjectRepository(SpecialCriterion)
    private readonly specialCriteriaRepository: Repository<SpecialCriterion>,
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    @InjectRepository(SpecialCriterionQuestion)
    private readonly specialCriterionQuestionRepository: Repository<SpecialCriterionQuestion>,
    @InjectRepository(Matchmaking)
    private readonly matchmakingRepository: Repository<Matchmaking>,
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async addQuestionsToSpecialCriteria(dto: AddQuestionDto) {
    const specialCriteria = await this.specialCriteriaRepository.findOne({
      where: { id: dto.specialCriteriaId },
      relations: ['questions'],
    });

    if (!specialCriteria) {
      throw new Error('SpecialCriteria not found');
    }

    const questions = await this.questionsRepository.findBy({
      id: In([...dto.questionIds]),
    });
    specialCriteria.questions.push(...questions);

    return await this.specialCriteriaRepository.save(specialCriteria);
  }
  async removeQuestionsToSpecialCriteria(dto: AddQuestionDto) {
    let specialCriteria = await this.specialCriteriaRepository.findOne({
      where: { id: dto.specialCriteriaId },
    });

    if (!specialCriteria) {
      throw new Error('SpecialCriteria not found');
    }

    dto.questionIds.map(async (id, index) => {
      await this.specialCriterionQuestionRepository.delete({
        specialCriteriaId: specialCriteria.id,
        questionsId: id,
      });
    });

    specialCriteria = await this.specialCriteriaRepository.findOne({
      where: { id: dto.specialCriteriaId },
      relations: ['questions', 'questions.answers', 'investorProfile'],
    });

    return specialCriteria;
  }

  async create(createSpecialCriterionDto: CreateSpecialCriterionDto) {
    const specialCriteria = await this.specialCriteriaRepository.create(
      createSpecialCriterionDto,
    );
    specialCriteria.investorProfile = {
      id: createSpecialCriterionDto.investorProfileId,
    } as InvestorProfile;
    return await this.specialCriteriaRepository.save(specialCriteria);
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.specialCriteriaRepository.find({
      skip,
      take: limit,
      relations: ['questions', 'questions.answers', 'investorProfile'],
    });
  }

  async findOne(id: number) {
    const special = await this.specialCriteriaRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.answers', 'investorProfile'],
    });
    if (!special) {
      throw new NotFoundException(`Special criteria with id ${id} not found`);
    }
    return special;
  }

  async update(
    id: number,
    updateSpecialCriterionDto: UpdateSpecialCriterionDto,
  ) {
    const { title, description } = updateSpecialCriterionDto;
    const updates = {};
    if (title) updates['title'] = title;
    if (description) updates['description'] = description;
    if (Object.keys(updates).length > 0)
      await this.specialCriteriaRepository.update(id, updates);
    return this.specialCriteriaRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.specialCriteriaRepository.delete(id);
  }

  findByInvestorProfileId(
    investorProfileId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.specialCriteriaRepository.find({
      where: {
        investorProfile: { id: investorProfileId },
      },
      skip,
      take: limit,
      relations: ['questions', 'questions.answers', 'investorProfile'],
    });
  }

  async findByCompanyId(
    companyId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const investorProfileIds = await this.matchmakingRepository
      .find({ where: { company: { id: companyId } } })
      .then((matches) => matches.map((match) => match.investorProfile.id));
    const skip = (page - 1) * limit;
    return this.specialCriteriaRepository.find({
      where: {
        investorProfile: { id: In([...investorProfileIds]) },
      },
      skip,
      take: limit,
      relations: ['questions', 'questions.answers', 'investorProfile'],
    });
  }

  async findCompaniesThatAnsweredCriteria(
    specialCriteriaId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    // Find the special criteria with its related questions
    const specialCriteria = await this.specialCriteriaRepository.findOne({
      where: { id: specialCriteriaId },
      relations: ['questions', 'questions.answers'], // Load answers too
    });
  
    if (!specialCriteria) {
      throw new NotFoundException(`Special criteria with id ${specialCriteriaId} not found`);
    }
  
    const questionIds = specialCriteria.questions.map(question => question.id);
  
    // Calculate the total weight for the special criteria
    const totalWeight = specialCriteria.questions.reduce((sum, question) => {
      const highestWeight = Math.max(...question.answers.map(answer => answer.weight));
      return sum + highestWeight;
    }, 0);
  
    // Fetch submissions related to the questions, including answers
    const submissions = await this.submissionRepository.find({
      where: { question: { id: In(questionIds) } },
      relations: ['user', 'answer'],
    });
  
    // Create a map to store the total score for each user
    const userScores: { [key: number]: number } = {};
  
    for (const submission of submissions) {
      const userId = submission.user.id;
      const answerWeight = submission.answer.weight;
  
      // Add the weight of the answer to the user's score
      userScores[userId] = (userScores[userId] || 0) + answerWeight;
    }
  
    // Calculate percentage scores for users
    const userPercentageScores = Object.entries(userScores).map(([userId, score]) => ({
      userId: Number(userId),
      percentageScore: Math.min(Math.round((score / totalWeight) * 100), 100),
    }));
  
    // Apply pagination
    const skip = (page - 1) * limit;
    const users = await this.userRepository.find({
      where: {
        id: In(Object.keys(userScores).map(Number)),
      },
      skip,
      take: limit,
    });
  
    // Fetch companies associated with these users in a single query
    const userIdsForCompanies = users.map(user => user.id);
    const companies = await this.companyRepository.find({
      where: {
        user: { id: In(userIdsForCompanies) },
      },
      relations: ['user'], // Assuming companies are linked to users
    });
  
    // Build the result object with percentageScore per company
    const companiesWithScores = companies.map(company => {
      const userScore = userPercentageScores.find(score => score.userId === company.user.id);
      const percentageScore = userScore ? userScore.percentageScore : 0;
      const { user, ...companyWithoutUser } = company;
  
      return {
        ...companyWithoutUser,
        percentageScore,
      };
    });
  
    const result = {
      companies: companiesWithScores,
    };
  
    return result;
  }  
}
