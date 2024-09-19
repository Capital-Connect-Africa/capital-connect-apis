import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ArrayContains, Between, LessThan, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { Role } from '../auth/role.enum';
import { Matchmaking } from '../matchmaking/entities/matchmaking.entity';
import { MatchStatus } from '../matchmaking/MatchStatus.enum';
import { SpecialCriterion } from 'src/special-criteria/entities/special-criterion.entity';
import { InvestorProfile } from '../investor-profile/entities/investor-profile.entity';
import { Company } from '../company/entities/company.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import { UseOfFunds } from 'src/use-of-funds/entities/use-of-funds.entity';
import { Stage } from 'src/stage/entities/stage.entity';
import { Country } from 'src/country/entities/country.entity';

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
    @InjectRepository(UseOfFunds)
    private readonly useOfFundsRepository: Repository<UseOfFunds>,
    @InjectRepository(Stage)
    private readonly stagesRepository: Repository<Stage>,
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
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


  async getBusinessesStatistics (): Promise<{totalBusinesses: number}>{
    const stats = {
      totalBusinesses: await this.companyRepository.count()
    }
    return stats;
  }

  async getBusinessesPerStage(): Promise<{ [stage: string]: number }> {
    const stages = await this.stagesRepository.find();

    const result: { [stage: string]: number } = {};

    await Promise.all(
      stages.map(async (stage) => {
            const totalBusinesses = await this.companyRepository.count({
                where: { growthStage: stage.title as string },
            });

            result[stage.title] = totalBusinesses;
        })
    );

    return result;
  }

  async getCompaniesPerCountry(): Promise<{ [country: string]: number }> {
    const countries = await this.countriesRepository.find(); 

    const result: { [country: string]: number } = {};

    await Promise.all(
      countries.map(async (country) => {
            const totalCompanies = await this.companyRepository.count({
                where: { country: country.name }, 
            });

            result[country.name] = totalCompanies;
        })
    );

    return result;
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

  async getInvestorsAndCompaniesPerSector(): Promise<{ [sectorName: string]: { investors: number; companies: number } }> {
    const sectors = await this.sectorRepository.find();

    const result: { [sectorName: string]: { investors: number; companies: number } } = {};

    await Promise.all(
        sectors.map(async (sector) => {
            const totalInvestors = await this.investorProfileRepository.count({
                where: { sectors: sector },
            });

            const totalCompanies = await this.companyRepository.count({
                where: { businessSector: sector.name },
            });

            result[sector.name] = {
              companies: totalCompanies,  
              investors: totalInvestors,
            };
        })
    );

    return result;
  }

  async getInvestorsPerFunding(fundingType: 'minimumFunding' | 'maximumFunding'): Promise<{
    low: number;
    mid: number;
    upper: number;
    top: number;
  }> {
    const low = await this.investorProfileRepository.count({
      where: {
        [fundingType]: LessThan(10001),
      },
    });

    const mid = await this.investorProfileRepository.count({
      where: {
        [fundingType]: Between(10001, 100000),
      },
    });

    const upper = await this.investorProfileRepository.count({
      where: {
        [fundingType]: Between(100001, 10000000),
      },
    });

    const top = await this.investorProfileRepository.count({
      where: {
        [fundingType]: MoreThan(10000001),
      },
    });

    return { low, mid, upper, top };
  }

  async getInvestorsAndCompaniesByFunding(): Promise<{ [fundingType: string]: { investors: number; companies: number } }> {
    const useOfFunds = await this.useOfFundsRepository.find();

    const result: { [fundingType: string]: { investors: number; companies: number } } = {};

    await Promise.all(
      useOfFunds.map(async (fund) => {
              const totalCompanies = await this.companyRepository.count({
                where: { useOfFunds: fund.title },
            }); 

            const totalInvestors = await this.investorProfileRepository.count({
                where: { useOfFunds: ArrayContains([fund.title]) },
            });         

            result[fund.title] = {
              companies: totalCompanies,
              investors: totalInvestors,
            };
        })
    );

    return result;
  }
}
