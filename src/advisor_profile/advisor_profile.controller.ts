import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AdvisorProfileService } from './advisor_profile.service';
import { AdvisorProfile } from './entities/advisor_profile.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateAdvisorProfileDto } from './dto/create-advisor_profile.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('advisor-profile')
export class AdvisorProfileController {
  constructor(private readonly advisorProfileService: AdvisorProfileService) {}

  @Post()
  create(@Body() createAdvisorProfileDto: CreateAdvisorProfileDto): Promise<AdvisorProfile> {
    return this.advisorProfileService.create(createAdvisorProfileDto);
  }

  @Get()
  findAll(): Promise<AdvisorProfile[]> {
    return this.advisorProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<AdvisorProfile> {
    return this.advisorProfileService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number, @Body() updateAdvisorDto: 
    Partial<AdvisorProfile>): Promise<AdvisorProfile> 
    {
    return this.advisorProfileService.update(id, updateAdvisorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.advisorProfileService.remove(id);
  }
}
