import { Module } from '@nestjs/common';
import { Queue } from 'bullmq';
import { redisOptions } from '../redis/redis.config';
import { BrevoService } from '../brevo.service';
import { OtpService } from '../../mobile/otp.service';

@Module({
  providers: [
    BrevoService,
    OtpService,
    {
      provide: 'TASK_QUEUE',
      useFactory: () => new Queue('task-queue', { connection: redisOptions }),
    },
  ],
  exports: [BrevoService, OtpService, 'TASK_QUEUE'],
})
export class BullmqModule {}
