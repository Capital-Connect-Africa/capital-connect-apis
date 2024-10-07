import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeclineService } from './decline.service';
import { CreateDeclineReasonDto } from './dto/create-decline-reason.dto';
import { DeclineReason } from './entities/declineReasons.entity';
import { UpdateDeclineReasonDto } from './dto/update-decline-reason.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('decline-reasons')
export class DeclineController {
  constructor(private declineService: DeclineService) {}

  @Post()
  @Roles(Role.Admin)
  async create(
    @Body() createDeclineReasonDto: CreateDeclineReasonDto,
  ): Promise<DeclineReason> {
    return await this.declineService.create(createDeclineReasonDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<DeclineReason> {
    return await this.declineService.findOne(id);
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number): Promise<DeclineReason[]> {
    return this.declineService.findAll(page, limit);
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') id: number,
    @Body() updateDeclineReasonDto: UpdateDeclineReasonDto,
  ): Promise<DeclineReason> {
    return this.declineService.update(id, updateDeclineReasonDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: number): Promise<void> {
    return this.declineService.remove(id);
  }
}
