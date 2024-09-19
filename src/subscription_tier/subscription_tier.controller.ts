import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubscriptionTierService } from './subscription_tier.service';
import { CreateSubscriptionTierDto } from './dto/create-subscription_tier.dto';
import { UpdateSubscriptionTierDto } from './dto/update-subscription_tier.dto';

@Controller('subscription-tiers')
export class SubscriptionTierController {
  constructor(
    private readonly subscriptionTierService: SubscriptionTierService,
  ) {}

  @Post()
  create(@Body() createSubscriptionTierDto: CreateSubscriptionTierDto) {
    return this.subscriptionTierService.create(createSubscriptionTierDto);
  }

  @Get()
  findAll() {
    return this.subscriptionTierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionTierService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionTierDto: UpdateSubscriptionTierDto,
  ) {
    return this.subscriptionTierService.update(+id, updateSubscriptionTierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionTierService.remove(+id);
  }
}
