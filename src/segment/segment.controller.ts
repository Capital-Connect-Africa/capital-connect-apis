import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException, BadRequestException, UseGuards, Query, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { SegmentService } from './segment.service';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { SubSectorService } from 'src/subsector/subsector.service';
import { Segment } from './entities/segment.entity';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('segments')
export class SegmentController {
  constructor(
    private readonly segmentService: SegmentService,
    private readonly subSectorsService: SubSectorService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createSegmentDto: CreateSegmentDto) {
    try {
      await this.subSectorsService.findOne(createSegmentDto.subSectorId);
      const segment = new Segment();
      segment.name = createSegmentDto.name;
      segment.description = createSegmentDto.description;
      segment.subSector = { id: createSegmentDto.subSectorId } as any;
      return await this.segmentService.createSegment(segment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Segment must be associated with an existing sub-sector.');
      }
      throwInternalServer(error)
    }
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number){
    try {
      const segments = await this.segmentService.findAll(page, limit);
      return segments;
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.segmentService.findOne(+id);
    } catch (error) {
      throwInternalServer(error)
    }
  }

  @Get('sub-sectors/:subSectorId')
  async findSegments(@Param('subSectorId') subSectorId: number): Promise<Segment[]> {
    return this.segmentService.findSegments(subSectorId);
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateSegmentDto: UpdateSegmentDto) {
    try {
      await this.segmentService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(`Segment with id ${id} not found`);
      }
      throwInternalServer(error)
    }

    try {
      if (updateSegmentDto.subSectorId) {
        await this.subSectorsService.findOne(updateSegmentDto.subSectorId);
      }

      const segment = await this.segmentService.update(+id, updateSegmentDto);
      return segment;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Segment must be associated with an existing sub-sector.');
      }
      throwInternalServer(error)
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    try {
      this.segmentService.remove(+id);
    } catch (error) {
      throwInternalServer(error)
    }
  }
}
