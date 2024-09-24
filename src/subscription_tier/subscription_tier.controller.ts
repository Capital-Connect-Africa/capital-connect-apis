import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, ParseIntPipe,
  UseGuards
} from "@nestjs/common";
import { SubscriptionTierService } from './subscription_tier.service';
import { CreateSubscriptionTierDto } from './dto/create-subscription_tier.dto';
import { UpdateSubscriptionTierDto } from './dto/update-subscription_tier.dto';
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/auth/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscription-tiers')
export class SubscriptionTierController {
  constructor(
    private readonly subscriptionTierService: SubscriptionTierService,
  ) {}

  @Post()
  @Roles(Role.Admin)
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
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionTierDto: UpdateSubscriptionTierDto,
  ) {
    return this.subscriptionTierService.update(+id, updateSubscriptionTierDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.subscriptionTierService.remove(+id);
  }
}
