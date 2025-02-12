import { Module } from '@nestjs/common';
import { AdvisorProfileService } from './advisor_profile.service';
import { AdvisorProfileController } from './advisor_profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvisorProfile } from './entities/advisor_profile.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdvisorProfile, User])],
  controllers: [AdvisorProfileController],
  providers: [AdvisorProfileService],
})
export class AdvisorProfileModule {}
