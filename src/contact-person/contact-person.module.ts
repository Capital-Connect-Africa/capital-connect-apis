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
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { TaskService } from '../shared/bullmq/task.service';
import { Queue } from 'bullmq';
import { BullModule } from '@nestjs/bullmq';
import { redisOptions } from '../shared/redis/redis.config';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      ContactPerson,
      InvestorProfile,
      Sector,
      SubSector,
      User,
    ]),
    BullModule.registerQueue({
      name: 'task-queue',
      connection: redisOptions,
    }),
  ],
  controllers: [ContactPersonController],
  providers: [
    ContactPersonService,
    TaskService,
    AuthService,
    UsersService,
    {
      provide: 'TASK_QUEUE',
      useFactory: (queue: Queue) => queue,
      inject: ['BullQueue_task-queue'],
    },
  ],
})
export class ContactPersonModule {}
