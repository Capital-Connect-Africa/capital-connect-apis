import { Module } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { MatchmakingController } from './matchmaking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities/company.entity';
import { InvestorProfile } from '../investor-profile/entities/investor-profile.entity';
import { Sector } from '../sector/entities/sector.entity';
import { SubSector } from '../subsector/entities/subsector.entity';
import { User } from '../users/entities/user.entity';
import { Submission } from '../submission/entities/submission.entity';
import { Question } from '../question/entities/question.entity';
import { Answer } from '../answer/entities/answer.entity';
import { CompanyModule } from '../company/company.module';
import { InvestorProfileModule } from '../investor-profile/investor-profile.module';
import { ContactPerson } from '../contact-person/entities/contact-person.entity';
import { Matchmaking } from './entities/matchmaking.entity';
import { DeclineReason } from './entities/declineReasons.entity';
import { DeclineService } from './decline.service';
import { DeclineController } from './decline.controller';
import { ConnectionRequestService } from './connectionRequest.service';
import { ConnectionRequestController } from './connectionRequest.controller';
import { ConnectionRequest } from './entities/connectionRequest.entity';
import { BrevoService } from '../shared/brevo.service';
import { UsersService } from 'src/users/users.service';
import { TaskService } from '../shared/bullmq/task.service';
import { Queue } from 'bullmq';
import { BullModule } from '@nestjs/bullmq';
import { redisOptions } from '../shared/redis/redis.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      User,
      Submission,
      Question,
      Answer,
      InvestorProfile,
      Sector,
      SubSector,
      ContactPerson,
      Matchmaking,
      DeclineReason,
      ConnectionRequest,
    ]),
    CompanyModule,
    InvestorProfileModule,
    BullModule.registerQueue({
      name: 'task-queue',
      connection: redisOptions,
    }),
  ],
  providers: [
    BrevoService,
    MatchmakingService,
    DeclineService,
    ConnectionRequestService,
    UsersService,
    TaskService,
    {
      provide: 'TASK_QUEUE',
      useFactory: (queue: Queue) => queue,
      inject: ['BullQueue_task-queue'],
    },
  ],
  controllers: [
    MatchmakingController,
    DeclineController,
    ConnectionRequestController,
  ],
})
export class MatchmakingModule {}
