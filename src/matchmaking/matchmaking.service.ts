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
    return await this.companyService.filterCompanies(filterDto);
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
  ): Promise<Matchmaking[]> {
    return this.matchmakingRepository.find({
      where: {
        investorProfile: { id: investorProfileId },
        status: 'interesting',
      },
      relations: ['company'],
    });
  }

  async getConnectedCompanies(
    investorProfileId: number,
  ): Promise<Matchmaking[]> {
    return this.matchmakingRepository.find({
      where: {
        investorProfile: { id: investorProfileId },
        status: 'connected',
      },
      relations: ['company'],
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
  async markAsNotInteresting(
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
      match.status = 'not interesting';
      return this.matchmakingRepository.save(match);
    }
  
    const noMatch = this.matchmakingRepository.create({
      investorProfile: { id: investorProfileId },
      company: { id: companyId },
      status: 'not interesting',
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
        match.status = 'disconnected';
        return this.matchmakingRepository.save(match);
      } else {
        throw new Error('Company is not currently connected');
      }
    }
  
    throw new Error('Matchmaking record not found');
  } 
}
