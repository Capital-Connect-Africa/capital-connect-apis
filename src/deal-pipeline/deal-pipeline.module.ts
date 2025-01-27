import { Module } from '@nestjs/common';
import { DealPipelineService } from './deal-pipeline.service';
import { DealPipelineController } from './deal-pipeline.controller';

@Module({
  providers: [DealPipelineService],
  controllers: [DealPipelineController]
})
export class DealPipelineModule {}
