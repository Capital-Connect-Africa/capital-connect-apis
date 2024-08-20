import { Injectable, NotFoundException } from '@nestjs/common';
import { InvestorProfileService } from '../investor-profile/investor-profile.service';
import { CompanyService } from '../company/company.service';
import { FilterCompanyDto } from '../company/dto/filter-company.dto';
import { FilterInvestorProfilesDto } from '../investor-profile/dto/filter-investor-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sector } from '../sector/entities/sector.entity';
import { Matchmaking } from './entities/matchmaking.entity';
import { Company } from '../company/entities/company.entity';
import { DeclineReason } from './entities/declineReasons.entity';

@Injectable()
export class MatchmakingService {
  constructor(
    private investorProfileService: InvestorProfileService,
    private companyService: CompanyService,
    @InjectRepository(Sector)
    private sectorsRepository: Repository<Sector>,
    @InjectRepository(Matchmaking)
    private readonly matchmakingRepository: Repository<Matchmaking>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(DeclineReason)
    private readonly declineReasonRepository: Repository<DeclineReason>
  ) {}

  async getMatchingCompanies(id) {
    const profileFound = await this.investorProfileService.findOneByUserId(id);
    if (!profileFound) {
      throw new NotFoundException();
    }

    const filterDto = new FilterCompanyDto();
    filterDto.countries = profileFound.countriesOfInvestmentFocus;
    filterDto.businessSectors = profileFound.sectors.map(
      (sector) => sector.name,
    );
    filterDto.growthStages = profileFound.businessGrowthStages;
    filterDto.registrationStructures = profileFound.registrationStructures;
    const companies = await this.companyService.filterCompanies(filterDto);
    const matchingCompanies = await this.getMatchedCompanies(profileFound.id);
    const companyIds = matchingCompanies.map((match) => match.company.id);
    return companies.filter(
      (company) => companyIds.includes(company.id) === false,
    );
  }

  async getMatchingInvestorProfiles(id) {
    const companyFound = await this.companyService.findOneByOwnerId(id);
    if (!companyFound) {
      throw new NotFoundException();
    }

    const filterDto = new FilterInvestorProfilesDto();
    const sector = await this.sectorsRepository.findOne({
      where: { name: companyFound.businessSector },
    });
    if (sector) {
      filterDto.sectors = [sector.id];
    }
    filterDto.countriesOfInvestmentFocus = [companyFound.country];
    filterDto.businessGrowthStages = [companyFound.growthStage];
    filterDto.registrationStructures = [companyFound.registrationStructure];
    return await this.investorProfileService.filter(filterDto);
  }

  async markAsInteresting(
    investorProfileId: number,
    companyId: number,
  ): Promise<Matchmaking> {
    const match = await this.matchmakingRepository.findOne({
      where: {
        investorProfile: { id: investorProfileId },
        company: { id: companyId },
      },
    });

    if (match) {
      match.status = 'interesting';
      return this.matchmakingRepository.save(match);
    }

    const newMatch = this.matchmakingRepository.create({
      investorProfile: { id: investorProfileId },
      company: { id: companyId },
      status: 'interesting',
    });

    return this.matchmakingRepository.save(newMatch);
  }

  async connectWithCompany(
    investorProfileId: number,
    companyId: number,
  ): Promise<Matchmaking> {
    const match = await this.matchmakingRepository.findOne({
      where: {
        investorProfile: { id: investorProfileId },
        company: { id: companyId },
      },
    });

    if (match) {
      match.status = 'connected';
      return this.matchmakingRepository.save(match);
    }

    throw new Error('Company must be marked as interesting first');
  }

  async getInterestingCompanies(
    investorProfileId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<Matchmaking[]> {
    return this.matchmakingRepository.find({
      where: {
        investorProfile: { id: investorProfileId },
        status: 'interesting',
      },
      relations: ['company'],
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async getConnectedCompanies(
    investorProfileId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<Matchmaking[]> {
    return this.matchmakingRepository.find({
      where: {
        investorProfile: { id: investorProfileId },
        status: 'connected',
      },
      relations: ['company'],
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async getMatchedCompanies(
    investorProfileId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<Matchmaking[]> {
    return this.matchmakingRepository.find({
      where: {
        investorProfile: { id: investorProfileId },
      },
      relations: ['company'],
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async getInterestedInvestors(companyId: number): Promise<Matchmaking[]> {
    return this.matchmakingRepository.find({
      where: {
        company: { id: companyId },
        status: 'interesting',
      },
      relations: ['investorProfile'],
    });
  }

  async getConnectedInvestors(companyId: number): Promise<Matchmaking[]> {
    return this.matchmakingRepository.find({
      where: {
        company: { id: companyId },
        status: 'connected',
      },
      relations: ['investorProfile'],
    });
  }

  // New methods added below.....
  async markAsDeclined(
    investorProfileId: number,
    companyId: number,
  ): Promise<Matchmaking> {
    const match = await this.matchmakingRepository.findOne({
      where: {
        investorProfile: { id: investorProfileId },
        company: { id: companyId },
      },
    });

    if (match) {
      match.status = 'declined';
      return this.matchmakingRepository.save(match);
    }

    const noMatch = this.matchmakingRepository.create({
      investorProfile: { id: investorProfileId },
      company: { id: companyId },
      status: 'declined',
    });

    return this.matchmakingRepository.save(noMatch);
  }

  async disconnectFromCompany(
    investorProfileId: number,
    companyId: number,
  ): Promise<Matchmaking> {
    const match = await this.matchmakingRepository.findOne({
      where: {
        investorProfile: { id: investorProfileId },
        company: { id: companyId },
      },
    });

    if (match) {
      if (match.status === 'connected') {
        match.status = 'interesting';
        return this.matchmakingRepository.save(match);
      } else {
        throw new Error('Company is not currently connected');
      }
    }

    throw new Error('Matchmaking record not found');
  }

  async getDeclinedCompanies(
    investorProfileId: number, 
    page: number = 1,
    limit: number = 10, 
  ): Promise<Matchmaking[]> {
    return this.matchmakingRepository.find({
      where: {
        investorProfile: { id: investorProfileId },
        status: 'declined',
      },
      relations: ['company'],
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async addDeclineReason(matchmakingId: number, declineReason: DeclineReason): Promise<Matchmaking> {
    const matchmaking = await this.matchmakingRepository.findOne({
      where: { id: matchmakingId },
      relations: ['declineReasons'],
    });

    if (!matchmaking) {
      throw new Error('Matchmaking not found');
    }

    matchmaking.declineReasons.push(declineReason);
    await this.matchmakingRepository.save(matchmaking);

    return matchmaking;
  }

  async searchCompanies(filterDto: FilterCompanyDto): Promise<Company[]> {
    return this.companyService.filterCompaniesByOr(filterDto);
  }
}
