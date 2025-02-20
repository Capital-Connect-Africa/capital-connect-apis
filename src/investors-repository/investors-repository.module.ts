import { Module } from '@nestjs/common';
import { InvestorsRepositoryController } from './investors-repository.controller';
import { InvestorsRepositoryService } from './investors-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorsRepository } from './entities/investors-repository.entity';
import { InvestorType } from 'src/investor-types/entities/investor-type.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import { SubSector } from 'src/subsector/entities/subsector.entity';
import { Country } from 'src/country/entities/country.entity';
import { EsgFocusAreas } from 'src/esg-focus/entities/esg-focus-areas.entity';
import { Stage } from 'src/stage/entities/stage.entity';
import { InvestmentStructure } from 'src/investment-structures/entities/investment-structure.entity';
import { UseOfFunds } from 'src/use-of-funds/entities/use-of-funds.entity';
import { InvestorsRepositorySearchHistory } from './entities/investors-respository-search-history.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [InvestorsRepositoryController],
  providers: [InvestorsRepositoryService, JwtService],
  imports: [
    TypeOrmModule.forFeature([
      InvestorsRepository,
      InvestorType,
      Sector,
      SubSector,
      Country,
      EsgFocusAreas,
      Stage,
      UseOfFunds,
      InvestmentStructure,
      InvestorsRepositorySearchHistory,
    ]),
  ],
  exports: [InvestorsRepositoryService],
})
export class InvestorsRepositoryModule {}
