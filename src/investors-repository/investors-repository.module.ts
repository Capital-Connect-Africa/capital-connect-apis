import { Module } from '@nestjs/common';
import { InvestorsRepositoryController } from './investors-repository.controller';
import { InvestorsRepositoryService } from './investors-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorsRepository } from './entities/investors-repository.entity';
import { InvestorType } from 'src/investor-types/entities/investor-type.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import { SubSector } from 'src/subsector/entities/subsector.entity';
import { InvestorRespostoryInvestees } from './entities/investor-repository-investees.entity';
import { Country } from 'src/country/entities/country.entity';
import { EsgFocusAreas } from 'src/esg-focus/entities/esg-focus-areas.entity';
import { Stage } from 'src/stage/entities/stage.entity';

@Module({
  controllers: [InvestorsRepositoryController],
  providers: [InvestorsRepositoryService],
  imports: [
    TypeOrmModule.forFeature([
      InvestorsRepository,
      InvestorType,
      Sector,
      SubSector,
      Country,
      EsgFocusAreas,
      Stage,
      InvestorRespostoryInvestees,
    ]),
  ],
  exports: [InvestorsRepositoryService],
})
export class InvestorsRepositoryModule {}
