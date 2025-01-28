import { Module } from '@nestjs/common';
import { Queue } from 'bullmq';
import { redisOptions } from '../redis/redis.config';
import { BrevoService } from '../brevo.service';

@Module({
  providers: [
    BrevoService,
    {
      provide: 'TASK_QUEUE',
      useFactory: () => new Queue('task-queue', { connection: redisOptions }),
    },
  ],
  exports: [BrevoService, 'TASK_QUEUE'],
})
export class BullmqModule {}
