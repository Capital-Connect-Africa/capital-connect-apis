import { Module } from '@nestjs/common';
import { SubSectorService } from './subsector.service';
import { SubSectorController } from './subsector.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubSector } from './entities/subsector.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import { SectorService } from 'src/sector/sector.service';
import { Segment } from 'src/segment/entities/segment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubSector, Sector, Segment])],
  controllers: [SubSectorController],
  providers: [SubSectorService, SectorService],
})
export class SubSectorModule {}
