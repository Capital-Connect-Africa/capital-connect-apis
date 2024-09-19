import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionTier } from './entities/subscription_tier.entity';
import { CreateSubscriptionTierDto } from './dto/create-subscription_tier.dto';
import { UpdateSubscriptionTierDto } from './dto/update-subscription_tier.dto';
import { User } from "../users/entities/user.entity";

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

  findOne(id: number) {
    return this.subscriptionTierRepository.findOne({ where: { id } });
  }

  update(id: number, updateSubscriptionTierDto: UpdateSubscriptionTierDto) {
    return this.subscriptionTierRepository.update(
      id,
      updateSubscriptionTierDto,
    );
  }

  remove(id: number) {
    return this.subscriptionTierRepository.delete(id);
  }
}
