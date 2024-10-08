import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionTier } from './entities/subscription_tier.entity';
import { User } from '../users/entities/user.entity';
import { UserSubscription } from './entities/userSubscription.entity';
import { SubscriptionTierEnum } from '../subscription/subscription-tier.enum';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SubscriptionTier)
    private readonly subscriptionTierRepository: Repository<SubscriptionTier>,
  ) {}

  async assignSubscription(
    userId: number,
    subscriptionTierId: number,
  ): Promise<UserSubscription> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const subscriptionTier = await this.subscriptionTierRepository.findOne({
      where: { id: subscriptionTierId },
    });

    if (!user || !subscriptionTier) {
      throw new Error('User or subscription tier not found');
    }

    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setFullYear(currentDate.getFullYear() + 1); // Set expiry to one year from the current date

    const userSubscription = this.userSubscriptionRepository.create({
      user,
      subscriptionTier,
      subscriptionDate: currentDate,
      expiryDate,
      isActive: true,
    });

    return await this.userSubscriptionRepository.save(userSubscription);
  }

  async validateSubscription(userId: number): Promise<boolean> {
    const userSubscription = await this.userSubscriptionRepository.findOne({
      where: {
        user: { id: userId },
        isActive: true,
      },
    });

    if (!userSubscription) {
      return false;
    }

    const currentDate = new Date();
    return currentDate < userSubscription.expiryDate;
  }

  async fetchSubscription(userId: number): Promise<UserSubscription> {
    const userSubscription = await this.userSubscriptionRepository.findOne({
      where: {
        user: { id: userId },
        isActive: true,
      },
      relations: ['subscriptionTier'],
    });

    if (!userSubscription) {
      throw new NotFoundException('User has no active subscription');
    } else {
      return userSubscription;
    }
  }

  async canUpgradeUserSubscription(
    userId: number,
    upgradeTier: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscriptions', 'subscriptions.subscriptionTier'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let currentTier = user.subscriptions?.find(
      (subscription) => subscription.isActive,
    )?.subscriptionTier?.name;
    if (!currentTier) {
      currentTier = SubscriptionTierEnum.BASIC;
    }

    const tierOrder = [
      SubscriptionTierEnum.BASIC,
      SubscriptionTierEnum.PLUS,
      SubscriptionTierEnum.PRO,
      SubscriptionTierEnum.ELITE,
    ];

    const userTierIndex = tierOrder.indexOf(currentTier);
    const nextTier = tierOrder.indexOf(upgradeTier as SubscriptionTierEnum);

    console.log('Current tier:', userTierIndex, nextTier);
    if (nextTier === -1) {
      throw new BadRequestException('This is not a valid subscription tier');
    }

    if (userTierIndex >= nextTier) {
      throw new BadRequestException(
        `Subscription upgrade from ${currentTier} to ${upgradeTier} is not possible`,
      );
    }

    return user;
  }

  findAll(page: number = 1, limit: number = 10): Promise<UserSubscription[]> {
    return this.userSubscriptionRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['user', 'subscriptionTier'],
      order: {id: 'DESC'},
    });
  }
}
