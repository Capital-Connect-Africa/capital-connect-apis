import { Module } from '@nestjs/common';
import { SegmentService } from './segment.service';
import { SegmentController } from './segment.controller';
import { Segment } from './entities/segment.entity';
import { SubSector } from 'src/subsector/entities/subsector.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubSectorService } from 'src/subsector/subsector.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubSector, Segment])],
  controllers: [SegmentController],
  providers: [SegmentService, SubSectorService],
})
export class SegmentModule {}
