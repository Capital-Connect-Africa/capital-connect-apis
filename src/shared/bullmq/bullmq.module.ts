import { Module } from '@nestjs/common';
import { Queue } from 'bullmq';
import { redisOptions } from '../redis/redis.config';

@Module({
  providers: [
    {
      provide: 'TASK_QUEUE',
      useFactory: () => new Queue('task-queue', { connection: redisOptions }),
    },
  ],
  exports: ['TASK_QUEUE'],
})
export class BullmqModule {}
