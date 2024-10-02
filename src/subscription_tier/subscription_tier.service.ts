import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionTier } from './entities/subscription_tier.entity';
import { CreateSubscriptionTierDto } from './dto/create-subscription_tier.dto';
import { UpdateSubscriptionTierDto } from './dto/update-subscription_tier.dto';
import { User } from '../users/entities/user.entity';
import { SubscriptionTierEnum } from '../subscription/subscription-tier.enum';

@Injectable()
export class SubscriptionTierService {
  constructor(
    @InjectRepository(SubscriptionTier)
    private subscriptionTierRepository: Repository<SubscriptionTier>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createSubscriptionTierDto: CreateSubscriptionTierDto) {
    const subscriptionTier = this.subscriptionTierRepository.create(
      createSubscriptionTierDto,
    );
    return this.subscriptionTierRepository.save(subscriptionTier);
  }

  findAll() {
    return this.subscriptionTierRepository.find();
  }

  async findOne(id: number) {
    const subscriptionTier = await this.subscriptionTierRepository.findOne({
      where: { id },
    });

    if (!subscriptionTier) {
      throw new NotFoundException(`Subscription tier with ID ${id} not found`);
    }
    return subscriptionTier;
  }

  async findOneByName(name: string) {
    const subscriptionTier = await this.subscriptionTierRepository.findOne({
      where: { name: name as SubscriptionTierEnum },
    });

    if (!subscriptionTier) {
      throw new NotFoundException(
        `Subscription tier with name ${name} not found`,
      );
    }
    return subscriptionTier;
  }

  update(id: number, updateSubscriptionTierDto: UpdateSubscriptionTierDto) {
    return this.subscriptionTierRepository.update(
      id,
      updateSubscriptionTierDto,
    );
  }

  async remove(id: number) {
    const result = await this.subscriptionTierRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Subscription tier with ID ${id} not found`);
    }

    return { message: `Subscription tier with ID ${id} successfully deleted` };
  }
}
