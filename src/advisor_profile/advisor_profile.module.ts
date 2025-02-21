import { Module } from '@nestjs/common';
import { AdvisorProfileService } from './advisor_profile.service';
import { AdvisorProfileController } from './advisor_profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvisorProfile } from './entities/advisor_profile.entity';
import { User } from 'src/users/entities/user.entity';
import { AdvisorTypesController } from './advisor.types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdvisorProfile, User])],
  controllers: [AdvisorProfileController, AdvisorTypesController],
  providers: [AdvisorProfileService],
})
export class AdvisorProfileModule {}
