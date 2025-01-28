import { Module } from '@nestjs/common';
import { DealPipelineService } from './deal-pipeline.service';
import { DealPipelineController } from './deal-pipeline.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from './entities/deal.entity';
import { DealStage } from './entities/deal-stage.entity';
import { User } from 'src/users/entities/user.entity';
import { DealAttachment } from './entities/deal-attachments.entity';
import { DealStageHistory } from './entities/deal-stage-history.entity';
import { DealCustomer } from './entities/deal-customer.entity';

@Module({
  providers: [DealPipelineService],
  controllers: [DealPipelineController],
  exports: [DealPipelineService],
  imports: [
    TypeOrmModule.forFeature([
      Deal,
      DealStage,
      User,
      DealCustomer,
      DealAttachment,
      DealStageHistory,
    ]),
  ],
})
export class DealPipelineModule {}
