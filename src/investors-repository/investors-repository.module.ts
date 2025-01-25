import { Module } from '@nestjs/common';
import { InvestorsRepositoryController } from './investors-repository.controller';
import { InvestorsRepositoryService } from './investors-repository.service';

@Module({
  controllers: [InvestorsRepositoryController],
  providers: [InvestorsRepositoryService]
})
export class InvestorsRepositoryModule {}
