import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionTier } from "./entities/subscription_tier.entity";
import { User } from "../users/entities/user.entity";
import { SubscriptionTierEnum } from "../subscription/subscription-tier.enum";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SubscriptionTier)
    private readonly subscriptionTierRepository: Repository<SubscriptionTier>,
  ) {}

  async assignSubscription(userId: number, subscriptionId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const subscriptionTier = await this.subscriptionTierRepository.findOneBy({ id: subscriptionId });

    if (!user || !subscriptionTier) {
      throw new Error('User or subscription tier not found');
    }

    user.subscriptionTier = subscriptionTier;
    return this.userRepository.save(user);
  }

  async validateSubscription(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscriptionTier'],
    });

    if (!user || !user.subscriptionTier) {
      return false;
    }
    return true;
  }

  async fetchSubscription(userId: number): Promise<SubscriptionTierEnum> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscriptionTier'],
    });

    if (!user || !user.subscriptionTier) {
      return SubscriptionTierEnum.BASIC;
    }
    return user.subscriptionTier.name as SubscriptionTierEnum;
  }
}