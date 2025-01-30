import { Module } from '@nestjs/common';
import { ShuftiIntegrationService } from './shufti_integration.service';
import { ShuftiIntegrationController } from './shufti_integration.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ShuftiIntegrationController],
  providers: [ShuftiIntegrationService],
})
export class ShuftiIntegrationModule {}
