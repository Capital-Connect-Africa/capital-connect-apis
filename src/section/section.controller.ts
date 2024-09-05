import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  BadRequestException,
  HttpCode,
  Query,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { SubsectionService } from 'src/subsection/subsection.service';

@Controller('sections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SectionController {
  constructor(
    private readonly sectionService: SectionService,
    private readonly subsectionService: SubsectionService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createSectionDto: CreateSectionDto) {
    try {
      return this.sectionService.create(createSectionDto);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.sectionService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.sectionService.findOne(+id);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    try {
      await this.sectionService.findOne(+id);
      const section = await this.sectionService.update(+id, updateSectionDto);
      return section;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Section with id ${id} not found`);
      }
      throwInternalServer(error);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.sectionService.remove(+id);
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get(':id/subsections')
  async findSubsections(@Param('id') id: string) {
    try {
      return await this.subsectionService.findSubsections(+id);
    } catch (error) {
      throwInternalServer(error);
    }
  }
}
