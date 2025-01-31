import { Module } from '@nestjs/common';
import { MobileNumberController } from './mobile-number.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileNumber } from './entities/mobile-number.entity';
import { MobileNumberService } from './mobile-number.service';
import { OtpService } from './otp.service';
import { TaskService } from '../shared/bullmq/task.service';
import { Queue } from 'bullmq';
import { BullModule } from '@nestjs/bullmq';
import { redisOptions } from '../shared/redis/redis.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([MobileNumber]),
    BullModule.registerQueue({
      name: 'task-queue',
      connection: redisOptions,
    }),
  ],
  controllers: [MobileNumberController],
  providers: [
    MobileNumberService,
    OtpService,
    TaskService,
    {
      provide: 'TASK_QUEUE',
      useFactory: (queue: Queue) => queue,
      inject: ['BullQueue_task-queue'],
    },
  ],
})
export class MobileNumberModule {}
