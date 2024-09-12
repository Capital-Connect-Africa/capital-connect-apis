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
}
