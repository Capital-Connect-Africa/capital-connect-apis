import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionTierEntity } from './entities/subscription_tier.entity';
import { CreateSubscriptionTierDto } from './dto/create-subscription_tier.dto';
import { UpdateSubscriptionTierDto } from './dto/update-subscription_tier.dto';

@Injectable()
export class SubscriptionTierService {
  constructor(
    @InjectRepository(SubscriptionTierEntity)
    private subscriptionTierRepository: Repository<SubscriptionTierEntity>,
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
