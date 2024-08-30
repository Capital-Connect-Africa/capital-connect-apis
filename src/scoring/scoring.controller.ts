import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { CreateScoringDto } from './dto/create-scoring.dto';
import { UpdateScoringDto } from './dto/update-scoring.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import throwInternalServer from 'src/shared/utils/exceptions.util';

@Controller('scorings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScoringController {
  constructor(private readonly scoringsService: ScoringService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createScoringDto: CreateScoringDto) {
    try {
      return this.scoringsService.create(createScoringDto);
    } catch (error) {
      throwInternalServer(error);
    }
    return this.scoringsService.create(createScoringDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.scoringsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.scoringsService.findOne(+id);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') id: string,
    @Body() updateScoringDto: UpdateScoringDto,
  ) {
    try {
      await this.scoringsService.findOne(+id);
      const scorings = await this.scoringsService.update(+id, updateScoringDto);
      return scorings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Scorings with id ${id} not found`);
      }
      throwInternalServer(error);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.scoringsService.remove(+id);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get('score/:userScore')
  getScoring(
    @Param('userScore') userScore: number,
    @Query('type') type: string,
  ) {
    return this.scoringsService.getScoring(userScore, type);
  }
}
