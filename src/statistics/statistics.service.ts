import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../auth/role.enum';
import { Matchmaking } from '../matchmaking/entities/matchmaking.entity';
import { MatchStatus } from '../matchmaking/MatchStatus.enum';
import { SpecialCriterion } from 'src/special-criteria/entities/special-criterion.entity';
import { InvestorProfile } from '../investor-profile/entities/investor-profile.entity';
import { Company } from '../company/entities/company.entity';
import { Sector } from 'src/sector/entities/sector.entity';

interface StatsFilter {
  investorProfile?: InvestorProfile;
  company?: Company;
}

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Matchmaking)
    private readonly matchMakingRepository: Repository<Matchmaking>,
    @InjectRepository(SpecialCriterion)
    private readonly specialCriteriaRepository: Repository<SpecialCriterion>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(InvestorProfile)
    private readonly investorProfileRepository: Repository<InvestorProfile>,
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
  ) {}

  async getUserStatistics(): Promise<{ [key in Role]: number }> {
    const stats = {
      [Role.User]: await this.userRepository.count({
        where: { roles: Role.User },
      }),
      [Role.Investor]: await this.userRepository.count({
        where: { roles: Role.Investor },
      }),
      [Role.Admin]: await this.userRepository.count({
        where: { roles: Role.Admin },
      }),
      [Role.Advisor]: await this.userRepository.count({
        where: { roles: Role.Advisor },
      }),
    };

    return stats;
  }

  async getMatchMakingStatistics(
    filter: StatsFilter = {} as StatsFilter,
  ): Promise<{
    interesting: number;
    declined: number;
    connected: number;
    requested: number;
  }> {
    const interesting = await this.matchMakingRepository.count({
      where: { status: MatchStatus.INTERESTING, ...filter },
    });

    const declined = await this.matchMakingRepository.count({
      where: { status: MatchStatus.DECLINED, ...filter },
    });

    const connected = await this.matchMakingRepository.count({
      where: { status: MatchStatus.CONNECTED, ...filter },
    });

    const requested = await this.matchMakingRepository.count({
      where: { status: MatchStatus.REQUESTED, ...filter },
    });

    return {
      interesting,
      declined,
      connected,
      requested,
    };
  }

  async getMatchMakingStatisticsPerInvestor(investorId: number): Promise<{
    interesting: number;
    declined: number;
    connected: number;
    requested: number;
  }> {
    return await this.getMatchMakingStatistics({
      investorProfile: { id: investorId } as InvestorProfile,
    });
  }
  async getMatchMakingStatisticsPerCompany(companyId: number): Promise<{
    interesting: number;
    declined: number;
    connected: number;
    requested: number;
  }> {
    return await this.getMatchMakingStatistics({
      company: { id: companyId } as Company,
    });
  }

  async getSpecialCriteriaStatistics(): Promise<{
    criteria: number;
  }> {
    const criteria = await this.specialCriteriaRepository.count();

    return { criteria };
  }

  async getSpecialCriteriaStatisticsInvestor(investorId: number): Promise<{
    criteria: number;
  }> {
    const criteria = await this.specialCriteriaRepository.count({
      where: {
        investorProfile: { id: investorId },
      },
    });

    return { criteria };
  }

  async getBusinessesStatistics(
    stage?: string, 
    country?: string, 
    sector?: string, 
    funds?: number
  ): Promise<{ totalBusinesses: number }> {
    const query: any = {};
  
    if (stage) {
      query.growthStage = stage;
    }
  
    if (country) {
      query.country = country;
    }
  
    if (sector) {
      query.businessSector = sector;
    }
  
    if (funds !== undefined) {
      query.fundsNeeded = funds;
    }
  
    const totalBusinesses = await this.companyRepository.count({
      where: query,
    });
  
    return { totalBusinesses };
  }  
/*
  async getBusinessesPerFundRaise(): Promise<{ 
    Idea: number; 
  }> {
    const Idea = await this.companyRepository.count({
      where: { fund: 'Idea' },
    });
  
    return { 
      Idea,
   };
  } */
  async getInvestorsStatistics (): Promise<{totalInvestors: number}>{
    const stats = {
      totalInvestors: await this.investorProfileRepository.count()
    }
    return stats;
  }

  async getInvestorsPerSector(sectorName: string): Promise<{ totalInvestors: number }> {
    const sector = await this.sectorRepository.findOne({
        where: { name: sectorName },
    });

    if (!sector) {
        return { totalInvestors: 0 };
    }
    const totalInvestors = await this.investorProfileRepository.count({
        where: { sectors: sector },
    });

    return { totalInvestors };
  }

  async getInvestorsPerMinimumFunding(minFunds: number): Promise<{ totalInvestors: number }> {
    const totalInvestors = await this.investorProfileRepository.count({
      where: { minimumFunding: minFunds },
    });
  
    return { totalInvestors };
  }

  async getInvestorsPerMaximumFunding(maxFunds: number): Promise<{ totalInvestors: number }> {
    const totalInvestors = await this.investorProfileRepository.count({
      where: { maximumFunding: maxFunds },
    });
  
    return { totalInvestors };
  }

  async getInvestorsPerFundingType(fundType: string): Promise<{ totalInvestors: number }> {
    const totalInvestors = await this.investorProfileRepository.count({
      where: { differentFundingVehicles: fundType },
    });
  
    return { totalInvestors };
  }
}
