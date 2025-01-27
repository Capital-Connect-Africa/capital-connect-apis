import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Referral } from './entities/referral.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateReferralMetricsDto } from './dto/UpdateReferralMetricsDto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserReferralService {
  constructor(
    @InjectRepository(Referral)
    private readonly userReferralRepository: Repository<Referral>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findReferrals(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Referral[]; total_count: number }> {
    try {
      const skip = (page - 1) * limit;
      const referrals = await this.userReferralRepository.find({
        skip,
        take: limit,
        relations: ['user', 'user.referredUsers'],
        order: {
          id: 'DESC',
        },
      });
      return {
        data: referrals,
        total_count: await this.userReferralRepository.count(),
      };
    } catch (error) {
      throw error as InternalServerErrorException;
    }
  }

  async findUserReferrals(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Referral[]; total_count: number }> {
    try {
      const skip = (page - 1) * limit;
      const referrals = await this.userReferralRepository.find({
        skip,
        take: limit,
        where: { user: { id: userId } },
        relations: ['user', 'user.referredUsers'],
        order: {
          id: 'DESC',
        },
      });
      return {
        data: referrals,
        total_count: await this.userReferralRepository.count({
          where: { user: { id: userId } },
        }),
      };
    } catch (error) {
      throw error as InternalServerErrorException;
    }
  }

  async updateUserReferrals(userId: number, body: UpdateReferralMetricsDto) {
    try {
      const { clicks, visits } = body;

      const referral = await this.userReferralRepository.findOneBy({
        user: { id: userId },
      });
      if (referral) {
        let userReferralLinkClicks = referral.clicks;
        let userReferralLinkVisits = referral.visits;
        if (clicks) userReferralLinkClicks += 1;
        if (visits) userReferralLinkVisits += 1;
        await this.userReferralRepository.update(referral.id, {
          clicks: userReferralLinkClicks,
          visits: userReferralLinkVisits,
        });
      } else {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) return;
        const newUserReferral = this.userReferralRepository.create({
          clicks: clicks ? 1 : 0,
          visits: visits ? 1 : 0,
          user,
        });
        await this.userReferralRepository.save(newUserReferral);
      }
      return;
    } catch (error) {
      throw error as BadRequestException;
    }
  }

  async removeReferral(referralId: number) {
    try {
      const referral = await this.userReferralRepository.findOneBy({
        id: referralId,
      });
      if (referral) {
        await this.userReferralRepository.delete({ id: referralId });
        return;
      }
      throw new NotFoundException(`Referral with id ${referralId} not found`);
    } catch (error) {
      throw error;
    }
  }

  async getStats() {
    const referrals = await this.userReferralRepository.find({
      relations: ['user', 'user.referredUsers'],
      order: {
        id: 'DESC',
      },
    });

    const stats = referrals.reduce(
      (acc, referral) => {
        acc.clicks += referral.clicks || 0;
        acc.visits += referral.visits || 0;
        acc.signups += referral.user?.referredUsers?.length || 0;
        return acc;
      },
      { clicks: 0, visits: 0, signups: 0 },
    );

    return stats;
  }
}
