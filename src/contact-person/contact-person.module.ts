import { Module } from '@nestjs/common';
import { ContactPersonService } from './contact-person.service';
import { ContactPersonController } from './contact-person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactPerson } from './entities/contact-person.entity';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { InvestorProfile } from '../investor-profile/entities/investor-profile.entity';
import { Sector } from '../sector/entities/sector.entity';
import { SubSector } from '../subsector/entities/subsector.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      ContactPerson,
      InvestorProfile,
      Sector,
      SubSector,
    ]),
  ],
  controllers: [ContactPersonController],
  providers: [ContactPersonService, UsersService],
})
export class ContactPersonModule {}
