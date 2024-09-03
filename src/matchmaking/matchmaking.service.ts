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
import { MatchStatus } from './MatchStatus.enum';
import { Readable } from 'stream';
import { format } from 'fast-csv';

@Injectable()
export class MatchmakingService {
  constructor(
    private investorProfileService: InvestorProfileService,
    private companyService: CompanyService,
    @InjectRepository(Sector)
    private sectorsRepository: Repository<Sector>,
    @InjectRepository(Matchmaking)
    private readonly matchmakingRepository: Repository<Matchmaking>,
  ) {}

  async getMatchingCompanies(id: number) {
    const profileFound = await this.investorProfileService.findOneByUserId(id);
    if (!profileFound) {
      throw new NotFoundException('Investor profile not found');
    }

    const filterDto = new FilterCompanyDto();
    filterDto.countries = profileFound.countriesOfInvestmentFocus;
    filterDto.businessSectors = profileFound.sectors.map(
      (sector) => sector.name,
    );
    filterDto.growthStages = profileFound.businessGrowthStages;
    filterDto.registrationStructures = profileFound.registrationStructures;
    const companies = await this.companyService.filterCompanies(filterDto);
    const matchingCompanies = await this.getMatchedCompaniesForFiltering(
      profileFound.id,
    );
    const companyIds = matchingCompanies.map((match) => match.company.id);
    return companies.filter(
      (company) => companyIds.includes(company.id) === false,
    );
  }

  async getMatchingCompaniesByInvestorProfileId(id: number) {
    const profileFound = await this.investorProfileService.findOne(id);
    if (!profileFound) {
      throw new NotFoundException('Investor profile not found');
    }

    const filterDto = new FilterCompanyDto();
    filterDto.countries = profileFound.countriesOfInvestmentFocus;
    filterDto.businessSectors = profileFound.sectors.map(
      (sector) => sector.name,
    );
    filterDto.growthStages = profileFound.businessGrowthStages;
    filterDto.registrationStructures = profileFound.registrationStructures;
    const companies = await this.companyService.filterCompanies(filterDto);
    const matchingCompanies = await this.getMatchedCompaniesForFiltering(
      profileFound.id,
    );
    const companyIds = matchingCompanies.map((match) => match.company.id);
    return companies.filter(
      (company) => companyIds.includes(company.id) === false,
    );
  }

  async getMatchingInvestorProfiles(id) {
    const companyFound = await this.companyService.findOneByOwnerId(id);
    if (!companyFound) {
      throw new NotFoundException('Company not found');
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
      match.status = MatchStatus.INTERESTING;
      return this.matchmakingRepository.save(match);
    }

    const newMatch = this.matchmakingRepository.create({
      investorProfile: { id: investorProfileId },
      company: { id: companyId },
      status: MatchStatus.INTERESTING,
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
      match.status = MatchStatus.CONNECTED;
      return this.matchmakingRepository.save(match);
    }

    throw new Error('Company must be marked as interesting first');
  }

  async getCompanies(
    investorProfileId: number,
    page: number = 1,
    limit: number = 10,
    status: MatchStatus = MatchStatus.CONNECTED,
  ): Promise<Matchmaking[]> {
    return this.matchmakingRepository.find({
      where: {
        investorProfile: { id: investorProfileId },
        status: status,
      },
      relations: ['company'],
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async getMatchedCompaniesForFiltering(
    investorProfileId: number,
  ): Promise<Matchmaking[]> {
    return this.matchmakingRepository.find({
      where: {
        investorProfile: { id: investorProfileId },
      },
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

  async getInvestors(
    companyId: number,
    page: number = 1,
    limit: number = 10,
    status: MatchStatus = MatchStatus.CONNECTED,
  ): Promise<Matchmaking[]> {
    return this.matchmakingRepository.find({
      where: {
        company: { id: companyId },
        status: status,
      },
      relations: ['investorProfile'],
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async markAsDeclined(
    investorProfileId: number,
    companyId: number,
    declineReasons: string[],
  ): Promise<Matchmaking> {
    const match = await this.matchmakingRepository.findOne({
      where: {
        investorProfile: { id: investorProfileId },
        company: { id: companyId },
      },
    });

    if (match) {
      match.status = MatchStatus.DECLINED;
      match.declineReasons = declineReasons;
      return this.matchmakingRepository.save(match);
    }

    const noMatch = this.matchmakingRepository.create({
      investorProfile: { id: investorProfileId },
      company: { id: companyId },
      status: MatchStatus.DECLINED,
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
        match.status = MatchStatus.INTERESTING;
        return this.matchmakingRepository.save(match);
      } else {
        throw new Error('Company is not currently connected');
      }
    }

    throw new Error('Matchmaking record not found');
  }

  async addDeclineReason(
    matchmakingId: number,
    declineReason: DeclineReason,
  ): Promise<Matchmaking> {
    const matchmaking = await this.matchmakingRepository.findOne({
      where: { id: matchmakingId },
    });

    if (!matchmaking) {
      throw new Error('Matchmaking not found');
    }

    matchmaking.declineReasons = [
      ...matchmaking.declineReasons,
      declineReason.reason,
    ];
    await this.matchmakingRepository.save(matchmaking);

    return matchmaking;
  }

  async searchCompanies(filterDto: FilterCompanyDto): Promise<Company[]> {
    return this.companyService.filterCompaniesByOr(filterDto);
  }

  async generateMatchMakingCSV(
    investorProfileId: number,
    status = '',
  ): Promise<Readable> {
    const query = {
      investorProfile: { id: investorProfileId },
    };

    if (status.length > 0) {
      query['status'] = status;
    }

    const matchMakings = await this.matchmakingRepository.find({
      where: query,
      relations: ['company'],
    });

    console.log('matchMakings', matchMakings);

    const csvStream = format({
      headers: [
        'Company',
        'Business Sector',
        'Business Sub Sector',
        'Products And Services',
        'Registration Structure',
        'Investment Structure',
        'Use Of Funds',
        'Esg Focus Areas',
        'Funds Needed',
        'Years Of Operation',
        'Growth Stage',
        'Number Of Employees',
        'Full Time Business',
        'Status',
      ],
    });
    const readableStream = new Readable().wrap(csvStream);

    matchMakings.forEach((match) => {
      csvStream.write({
        Company: match.company.name,
        'Business Sector': match.company.businessSector,
        'Business Sub Sector': match.company.businessSubsector,
        'Products And Services': match.company.productsAndServices,
        'Registration Structure': match.company.registrationStructure,
        'Investment Structure': match.company.investmentStructure,
        'Use Of Funds': match.company.useOfFunds,
        'Esg Focus Areas': match.company.esgFocusAreas,
        'Funds Needed': match.company.fundsNeeded,
        'Years Of Operation': match.company.yearsOfOperation,
        'Growth Stage': match.company.growthStage,
        'Number Of Employees': match.company.numberOfEmployees,
        'Full Time Business': match.company.fullTimeBusiness,
        Status: match.status,
      });
    });

    csvStream.end();
    return readableStream;
  }

  async searchMatches(investorProfileId: number, status: string, q: string) {
    const query = {
      investorProfile: { id: investorProfileId },
    };

    if (status.length > 0) {
      query['status'] = status;
    }
    const matches = await this.matchmakingRepository.find({
      where: query,
      relations: ['company'],
      take: 50,
    });
    const companies = matches.map((match) => match.company);
    const filteredCompanies = await this.companyService.searchCompanies(
      companies,
      q,
    );
    return matches.filter((match) => filteredCompanies.includes(match.company));
  }

  async searchMatchesAdmin(status: string, q: string) {
    const query: any = {};

    if (status.length > 0) {
      query['status'] = status;
    }

    const matches = await this.matchmakingRepository.find({
      where: query,
      relations: ['company'],
      take: 50,
    });

    const companies = matches.map((match) => match.company);
    const filteredCompanies = await this.companyService.searchCompanies(
      companies,
      q,
    );

    return matches.filter((match) => filteredCompanies.includes(match.company));
  }
}
