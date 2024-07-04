import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository, } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { In, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import { Question } from 'src/question/entities/question.entity';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private userService: UsersService,
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(userId, createCompanyDto: CreateCompanyDto) {
    const userFound = await this.userService.findOne(userId)
    if(!userFound) {
        throw new NotFoundException('User not found');
    } else {
        const newCompany = this.companyRepository.create(createCompanyDto);
        newCompany.user = userFound;
        return this.companyRepository.save(newCompany);
    }
  }

  findAll() {
    return this.companyRepository.find();
  }

  async findOne(id: number) {
    const company = await this.companyRepository.findOneBy({ id });
    if (company) {
      return company;
    } else {
      throw new NotFoundException('company not available');
    }
  }

  async findOneByOwnerId(id: number) {
    const companies = await this.companyRepository.find({
      where: { user: {id}},
      relations: ['companyLogo']
    });
    if (companies.length > 0) {
      return companies[0];
    } else {
      throw new NotFoundException('company not available');
    }
  }

  async findOneByUser(user: User) {
    const company = await this.companyRepository.findOne({ where: { user } });
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
    const company = await this.findOne(id);
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
    const userFound = await this.userService.findOne(id);
    const investorSubmission = this.submissionRepository.find({
      relations: {
        question: true,
        answer: true,
      },
      where: {
        user: userFound,
      }
    });
    const ans = (await investorSubmission).map(sub2 => sub2.answer.text);
    const matchedBusinesses = this.companyRepository.find({
      where: {
        growthStage: In(ans),
        country: In(ans),
        businessSector: In(ans),
        registrationStructure: In(ans)
      }
    })
    const matched = [];
    (await matchedBusinesses).forEach((biz) => {
      var matchedMap = {};
      matchedMap['country'] = biz.country;
      matchedMap['businessSector'] = biz.businessSector;
      matchedMap['growthStage'] = biz.growthStage;
      matchedMap['registrationStructure'] = biz.registrationStructure;
      matched.push(matchedMap);
    })
    return matched;
  }


  async getMatchedInvestors(id: number) {
    const companyFound = await this.findOneByOwnerId(id);
    const submissions = await this.submissionRepository.createQueryBuilder("submission")
    .leftJoinAndSelect("submission.question", "question")
    .leftJoinAndSelect("submission.answer", "answer")
    .leftJoinAndSelect("submission.user", "user")
    .where("user.roles = :role", { role: "investor" })
    .orWhere("answer.text = :country", { country: companyFound.country })
    .orWhere("answer.text = :businessSector", { businessSector: companyFound.businessSector })
    .orWhere("answer.text = :growthStage", { growthStage: companyFound.growthStage })
    .orWhere("answer.text = :registrationStructure", { registrationStructure: companyFound.registrationStructure })
    .getMany();
      
    return submissions;
  }



}
