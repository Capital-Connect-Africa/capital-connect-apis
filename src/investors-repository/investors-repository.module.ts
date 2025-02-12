import { Module } from '@nestjs/common';
import { InvestorsRepositoryController } from './investors-repository.controller';
import { InvestorsRepositoryService } from './investors-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorsRepository } from './entities/investors-repository.entity';
import { InvestorType } from 'src/investor-types/entities/investor-type.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import { SubSector } from 'src/subsector/entities/subsector.entity';
import { InvestorRespostoryInvestees } from './entities/investor-repository-investees.entity';

@Module({
  controllers: [InvestorsRepositoryController],
  providers: [InvestorsRepositoryService],
  imports: [
    TypeOrmModule.forFeature([
      InvestorsRepository,
      InvestorType,
      Sector,
      SubSector,
      InvestorRespostoryInvestees,
    ]),
  ],
  exports: [InvestorsRepositoryService],
})
export class InvestorsRepositoryModule {}
