import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import { Question } from 'src/question/entities/question.entity';
import { FilterCompanyDto } from './dto/filter-company.dto';
import { NumberOfEmployees, YearsOfOperation } from './company.type';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Question)
    private userService: UsersService,
  ) {}

  getNumberOfEmployees(): Array<string> {
    return Object.values(NumberOfEmployees);
  }

  getYearsOfOperation(): Array<string> {
    return Object.values(YearsOfOperation);
  }

  async create(id: number, createCompanyDto: CreateCompanyDto) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) {
      throw new NotFoundException('User not found');
    } else {
      const newCompany = this.companyRepository.create(createCompanyDto);
      newCompany.user = userFound;
      return this.companyRepository.save(newCompany);
    }
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.companyRepository.find({
      skip,
      take: limit,
      relations: ['companyLogo', 'user'],
      order: {id: 'DESC'}
    });
  }

  async findOne(id: number){
    const company = await this.companyRepository.findOne({ where: { id } });
  
    if (!company) {
      throw new NotFoundException('Company not found');
    }
  
    return company;
  }
  

  async findOneByOwnerId(id: number) {
    const company = await this.companyRepository.findOne({
      where: { user: { id } },
      relations: ['companyLogo', 'user'],
    });
    if (company) {
      return company;
    } else {
      throw new NotFoundException('company not available');
    }
  }

  async findOneByUser(userId: number) {
    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
      relations: ['companyLogo', 'user'],
    });
    if (company) {
      return company;
    } else {
      throw new NotFoundException('company not available');
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findOne(id);
    if (!company) {
      throw new BadRequestException('company not available');
    }
    await this.companyRepository.update(id, updateCompanyDto);
    return this.companyRepository.findOneBy({ id });
  }

  async updateLogoUrl(id: number, logoId: number) {
    console.log('id', id);
    console.log('logoId', logoId);
    const company = await this.findOne(id);
    console.log('company', company);
    if (!company) {
      throw new BadRequestException('company not available');
    }
    company.companyLogo = { id: logoId } as any;
    await this.companyRepository.save(company);
    return this.companyRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.companyRepository.delete(id);
    return id;
  }

  async getMatchedBusinesses(id: number) {
    const userFound = await this.userRepository.findOne({ where: { id } });

    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    const investorSubmissions = await this.submissionsRepository.find({
      relations: {
        question: true,
        answer: true,
      },
      where: {
        user: userFound,
      },
    });

    // Group answers by questions
    const groupedAnswers = investorSubmissions.reduce((acc, submission) => {
      const questionText = submission.question.text;
      if (!acc[questionText]) {
        acc[questionText] = [];
      }
      acc[questionText].push(submission.answer.text);
      return acc;
    }, {});

    const growthStageAnswers =
      groupedAnswers[
        'What stage of business growth does your investments focus on?'
      ];
    const countryAnswers = groupedAnswers['Countries of Investment Focus'];
    const businessSectorAnswers = groupedAnswers['Sectors of Investment'];
    const registrationStructureAnswers =
      groupedAnswers[
        'Please select the various investment structures that you consider while financing businesses'
      ];

    // Use QueryBuilder to fetch matched businesses and log the query
    const matchedBusinessesQuery = this.companyRepository
      .createQueryBuilder('company')
      .where('company.growthStage IN (:...uniqueAnswers)', {
        uniqueAnswers: [...growthStageAnswers],
      })
      .orWhere('company.country IN (:...countryAnswers)', {
        countryAnswers: [...countryAnswers],
      })
      .orWhere('company.businessSector IN (:...businessSectorAnswers)', {
        businessSectorAnswers: [...businessSectorAnswers],
      })
      .orWhere(
        'company.registrationStructure IN (:...registrationStructureAnswers)',
        { registrationStructureAnswers: [...registrationStructureAnswers] },
      );

    // Log the generated query
    const matchedBusinessesSqlQuery = matchedBusinessesQuery.getSql();
    console.log(
      'Generated SQL Query for Matched Businesses:',
      matchedBusinessesSqlQuery,
    );

    const matchedBusinesses = await matchedBusinessesQuery.getMany();

    console.log('matchedBusinesses', matchedBusinesses);
    const matched = [];
    matchedBusinesses.forEach((biz) => {
      const matchedMap = {};
      if (
        countryAnswers.includes(biz.country) &&
        businessSectorAnswers.includes(biz.businessSector) &&
        growthStageAnswers.includes(biz.growthStage) &&
        registrationStructureAnswers.includes(biz.registrationStructure)
      ) {
        matchedMap['id'] = biz.id;
        matchedMap['country'] = biz.country;
        matchedMap['businessSector'] = biz.businessSector;
        matchedMap['growthStage'] = biz.growthStage;
        matchedMap['registrationStructure'] = biz.registrationStructure;
        matched.push(matchedMap);
      }
    });
    return matched;
  }

  async getSubmissionsWithAnswersGroupedByUser(
    answerTexts: string[],
  ): Promise<any[]> {
    try {
      const queryBuilder = this.submissionsRepository
        .createQueryBuilder('submission')
        .innerJoinAndSelect('submission.user', 'user')
        .innerJoinAndSelect('submission.question', 'question')
        .innerJoinAndSelect('submission.answer', 'answer')
        .where('user.roles = :role', { role: 'investor' })
        .andWhere('answer.text IN (:...answerTexts)', { answerTexts })
        .select([
          'submission.id as submission_id',
          'user.id as user_id',
          'user.firstName as user_firstname',
          'user.lastName as user_lastname',
          'question.id as question_id',
          'question.text as question_text',
          'answer.id as answer_id',
          'answer.text as answer_text',
          'answer.weight as answer_weight',
        ])
        .groupBy(
          'user.id, user.firstName, user.lastName, submission.id, question.id, question.text, answer.id, answer.text, answer.weight',
        );

      const results = await queryBuilder.getRawMany();

      const groupedResults = results.reduce((acc, curr) => {
        const userId = curr.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            username: curr.user_firstname + ' ' + curr.user_lastname,
            submissions: [],
          };
        }
        acc[userId].submissions.push({
          submissionId: curr.submission_id,
          question: {
            id: curr.question_id,
            text: curr.question_text,
          },
          answer: {
            id: curr.answer_id,
            text: curr.answer_text,
            weight: curr.answer_weight,
          },
        });
        return acc;
      }, {});

      return Object.values(groupedResults);
    } catch (error) {
      console.error('Error retrieving submissions:', error);
      throw error;
    }
  }

  async getMatchedInvestors(id: number) {
    const companyFound = await this.findOneByOwnerId(id);
    if (!companyFound) {
      throw new NotFoundException();
    }
    const responsesToMatch = [
      companyFound.country,
      companyFound.businessSector,
      companyFound.growthStage,
      companyFound.registrationStructure,
    ];
    const submissions =
      await this.getSubmissionsWithAnswersGroupedByUser(responsesToMatch);

    return submissions
      .filter(
        (submission) =>
          submission.submissions.length === responsesToMatch.length,
      )
      .map((inv) => {
        return { id: inv.id, name: inv.username };
      });
  }

  async filterCompanies(filterDto: FilterCompanyDto): Promise<Company[]> {
    const queryBuilder = this.companyRepository.createQueryBuilder('companies');

    const {
      countries,
      businessSectors,
      businessSubsectors,
      segments,
      productsAndServices,
      registrationStructures,
      yearsOfOperation,
      growthStages,
      numberOfEmployees,
      fullTimeBusiness,
    } = filterDto;

    if (countries && countries.length > 0) {
      queryBuilder.andWhere('companies.country IN (:...countries)', {
        countries,
      });
    }

    if (businessSectors && businessSectors.length > 0) {
      queryBuilder.andWhere(
        'companies.businessSector IN (:...businessSectors)',
        { businessSectors },
      );
    }

    if (businessSubsectors && businessSubsectors.length > 0) {
      queryBuilder.andWhere(
        'companies.businessSubsector IN (:...businessSubsectors)',
        { businessSubsectors },
      );
    }

    if (segments && segments.length > 0) {
      queryBuilder.andWhere(
        'companies.segments && ARRAY[:...segments]',
        { segments },
      );
    }    

    if (productsAndServices) {
      queryBuilder.andWhere(
        'companies.productsAndServices LIKE :productsAndServices',
        {
          productsAndServices: `%${productsAndServices}%`,
        },
      );
    }

    if (registrationStructures && registrationStructures.length > 0) {
      queryBuilder.andWhere(
        'companies.registrationStructure IN (:...registrationStructures)',
        { registrationStructures },
      );
    }

    if (yearsOfOperation) {
      queryBuilder.andWhere('companies.yearsOfOperation = :yearsOfOperation', {
        yearsOfOperation,
      });
    }

    if (growthStages && growthStages.length > 0) {
      queryBuilder.andWhere('companies.growthStage IN (:...growthStages)', {
        growthStages,
      });
    }

    if (numberOfEmployees) {
      queryBuilder.andWhere(
        'companies.numberOfEmployees = :numberOfEmployees',
        { numberOfEmployees },
      );
    }

    if (fullTimeBusiness !== undefined) {
      queryBuilder.andWhere('companies.fullTimeBusiness = :fullTimeBusiness', {
        fullTimeBusiness,
      });
    }

    const companies = await queryBuilder.getMany();
    return companies;
  }

  async filterCompaniesByOr(filterDto: FilterCompanyDto): Promise<Company[]> {
    const queryBuilder = this.companyRepository.createQueryBuilder('companies');

    const {
      countries,
      businessSectors,
      businessSubsectors,
      segments,
      productsAndServices,
      registrationStructures,
      investmentStructure,
      useOfFunds,
      esgFocusAreas,
      fundsNeeded,
      yearsOfOperation,
      growthStages,
      numberOfEmployees,
      fullTimeBusiness,
    } = filterDto;

    if (countries && countries.length > 0) {
      queryBuilder.orWhere('companies.country IN (:...countries)', {
        countries,
      });
    }

    if (businessSectors && businessSectors.length > 0) {
      queryBuilder.orWhere(
        'companies.businessSector IN (:...businessSectors)',
        { businessSectors },
      );
    }

    if (businessSubsectors && businessSubsectors.length > 0) {
      queryBuilder.orWhere(
        'companies.businessSubsector IN (:...businessSubsectors)',
        { businessSubsectors },
      );
    }

    if (segments && segments.length > 0) {
      queryBuilder.andWhere(
        'companies.segments && ARRAY[:...segments]',
        { segments },
      );
    }    

    if (productsAndServices) {
      queryBuilder.orWhere(
        'companies.productsAndServices LIKE :productsAndServices',
        {
          productsAndServices: `%${productsAndServices}%`,
        },
      );
    }

    if (registrationStructures && registrationStructures.length > 0) {
      queryBuilder.orWhere(
        'companies.registrationStructure IN (:...registrationStructures)',
        { registrationStructures },
      );
    }

    if (investmentStructure && investmentStructure.length > 0) {
      queryBuilder.orWhere(
        'companies.investmentStructure IN (:...investmentStructure)',
        { investmentStructure },
      );
    }

    if (useOfFunds && useOfFunds.length > 0) {
      queryBuilder.orWhere(
        'companies.useOfFunds IN (:...useOfFunds)',
        { useOfFunds },
      );
    }

    if (esgFocusAreas && esgFocusAreas.length > 0) {
      queryBuilder.orWhere(
        'companies.esgFocusAreas IN (:...esgFocusAreas)',
        { esgFocusAreas },
      );
    }

    if (fundsNeeded) {
      queryBuilder.orWhere(
        'companies.fundsNeeded = :fundsNeeded',
        { fundsNeeded },
      );
    }

    if (yearsOfOperation) {
      queryBuilder.orWhere('companies.yearsOfOperation = :yearsOfOperation', {
        yearsOfOperation,
      });
    }

    if (growthStages && growthStages.length > 0) {
      queryBuilder.orWhere('companies.growthStage IN (:...growthStages)', {
        growthStages,
      });
    }

    if (numberOfEmployees) {
      queryBuilder.orWhere('companies.numberOfEmployees = :numberOfEmployees', {
        numberOfEmployees,
      });
    }

    if (fullTimeBusiness !== undefined) {
      queryBuilder.orWhere('companies.fullTimeBusiness = :fullTimeBusiness', {
        fullTimeBusiness,
      });
    }

    const companies = await queryBuilder.getMany();
    return companies;
  }

  async searchCompanies(
    companies: Company[],
    query: string,
  ): Promise<Company[]> {
    if (!query) {
      return companies; // Return the full list if no query is provided
    }

    const lowerCaseQuery = query.toLowerCase();

    return companies.filter((company) =>
      Object.values(company).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(lowerCaseQuery),
      ),
    );
  }

  async profileCompleteness(companyId: number): Promise<{completeness: number}> {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
  
    if (!company) {
      throw new Error('Company not found');
    }
  
    const totalFields = Object.keys(company).length;
    let filledFields = 0;
  
    for (const key in company) {
      if (company[key] !== null && company[key] !== '') {
        filledFields++;
      }
    }
  
    const completeness = (filledFields / totalFields) * 100;
  
    return {completeness};
  }  

  async hideCompanyProfile(companyId: number, currentUser: User): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['user'], 
    });

    if (!company) {
      throw new Error('Company not found');
    }

    if (currentUser.roles.includes('admin') || company.user.id === currentUser.id) {
      company.isHidden = true;
      await this.companyRepository.save(company);
      return company;
    }

    throw new Error('You are not authorized to hide this company profile');
  }

  async unhideCompanyProfile( companyId: number, currentUser: User ): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['user'], 
    });

    if (!company) {
      throw new Error('Company not found');
    }

    if (currentUser.roles.includes('admin') || company.user.id === currentUser.id) {
      company.isHidden = false;
      await this.companyRepository.save(company);
      return company;
    }

    throw new Error('You are not authorized to unhide this company profile');
  }
}
