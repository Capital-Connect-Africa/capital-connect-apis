import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorProfileService } from './investor-profile.service';
import { InvestorProfileController } from './investor-profile.controller';
import { InvestorProfile } from './entities/investor-profile.entity';
import { Sector } from '../sector/entities/sector.entity';
import { SubSector } from '../subsector/entities/subsector.entity';
import { User } from 'src/users/entities/user.entity';
import { ContactPerson } from 'src/contact-person/entities/contact-person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestorProfile, Sector, SubSector, User, ContactPerson])],
  controllers: [InvestorProfileController],
  providers: [InvestorProfileService],
  exports: [InvestorProfileService],
})
export class InvestorProfileModule {}
