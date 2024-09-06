import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../auth/role.enum';
import { Matchmaking } from '../matchmaking/entities/matchmaking.entity';
import { MatchStatus } from '../matchmaking/MatchStatus.enum';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Matchmaking)
    private readonly matchMakingRepository: Repository<Matchmaking>,
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

  async getMatchMakingStatistics(): Promise<{
    interesting: number;
    declined: number;
    connected: number;
    requested: number;
  }> {
    const interesting = await this.matchMakingRepository.count({
      where: { status: MatchStatus.INTERESTING },
    });

    const declined = await this.matchMakingRepository.count({
      where: { status: MatchStatus.DECLINED },
    });

    const connected = await this.matchMakingRepository.count({
      where: { status: MatchStatus.CONNECTED },
    });

    const requested = await this.matchMakingRepository.count({
      where: { status: MatchStatus.REQUESTED },
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
    const interesting = await this.matchMakingRepository.count({
      where: {
        status: MatchStatus.INTERESTING,
        investorProfile: { id: investorId },
      },
    });

    const declined = await this.matchMakingRepository.count({
      where: {
        status: MatchStatus.DECLINED,
        investorProfile: { id: investorId },
      },
    });

    const connected = await this.matchMakingRepository.count({
      where: {
        status: MatchStatus.CONNECTED,
        investorProfile: { id: investorId },
      },
    });

    const requested = await this.matchMakingRepository.count({
      where: {
        status: MatchStatus.REQUESTED,
        investorProfile: { id: investorId },
      },
    });

    return {
      interesting,
      declined,
      connected,
      requested,
    };
  }
  async getMatchMakingStatisticsPerCompany(companyId: number): Promise<{
    interesting: number;
    declined: number;
    connected: number;
    requested: number;
  }> {
    const interesting = await this.matchMakingRepository.count({
      where: {
        status: MatchStatus.INTERESTING,
        company: { id: companyId },
      },
    });

    const declined = await this.matchMakingRepository.count({
      where: {
        status: MatchStatus.DECLINED,
        company: { id: companyId },
      },
    });

    const connected = await this.matchMakingRepository.count({
      where: {
        status: MatchStatus.CONNECTED,
        company: { id: companyId },
      },
    });

    const requested = await this.matchMakingRepository.count({
      where: {
        status: MatchStatus.REQUESTED,
        company: { id: companyId },
      },
    });

    return {
      interesting,
      declined,
      connected,
      requested,
    };
  }
}
