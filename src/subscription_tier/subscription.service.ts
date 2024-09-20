import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionTier } from "./entities/subscription_tier.entity";
import { User } from "../users/entities/user.entity";
import { SubscriptionTierEnum } from "../subscription/subscription-tier.enum";
import { UserSubscription } from "./entities/userSubscription.entity";

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

  async assignSubscription(userId: number, subscriptionTierId: number): Promise<UserSubscription> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const subscriptionTier = await this.subscriptionTierRepository.findOne({ where: { id: subscriptionTierId } });

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
      isActive: true, // Set subscription to active
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
}