import { Controller, Get, Post, Body, Param, Delete, UseGuards, BadRequestException, Put, HttpCode, Query, HttpStatus, NotFoundException } from '@nestjs/common';
import { SubSectorService } from './subsector.service';
import { CreateSubSectorDto } from './dto/create-subsector.dto';
import { UpdateSubSectorDto } from './dto/update-subsector.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { SectionService } from 'src/section/section.service';
import { SubSector } from './entities/subsector.entity';
import { SectorService } from 'src/sector/sector.service';

@Controller('subsectors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubSectorController {
  constructor(
    private readonly subSectorsService: SubSectorService,
    private readonly sectorsService: SectorService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createSubsectionDto: CreateSubSectorDto) {
    try {
      await this.sectorsService.findOne(createSubsectionDto.sectorId);
      const subsector = new SubSector();
      subsector.name = createSubsectionDto.name;
      subsector.description = createSubsectionDto.description;
      subsector.sector = { id: createSubsectionDto.sectorId } as any;
      return await this.subSectorsService.create(subsector);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('SubSector must be associated with an existing sector.');
      }
      throwInternalServer(error)
    }
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number){
    try {
      const subsections = await this.subSectorsService.findAll(page, limit);
      return subsections;
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.subSectorsService.findOne(+id);
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateSubsectionDto: UpdateSubSectorDto) {
    try {
      await this.subSectorsService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`SubSector with id ${id} not found`);
      }
      throwInternalServer(error)
    }

    try {
      if (updateSubsectionDto.sectorId) {
        await this.sectorsService.findOne(updateSubsectionDto.sectorId);
      }

      const subSection = await this.subSectorsService.update(+id, updateSubsectionDto);
      return subSection;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Sub sector must be associated with an existing sector.');
      }
      throwInternalServer(error)
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    try {
      this.subSectorsService.remove(+id);
    } catch (error) {
      throwInternalServer(error)
    }
  }
}
