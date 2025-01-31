import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class TaskService {
  constructor(@Inject('TASK_QUEUE') private readonly taskQueue: Queue) {}

  async addTask(data: any) {
    await this.taskQueue.add('task-name', data, { delay: 5000 });
  }

  async addRepeatingTask(data: any) {
    await this.taskQueue.add('repeating-task', data, {
      repeat: { pattern: '0 * * * *' }, // Run every hour
    });
  }

  async deleteRepeatingTask(taskData: any) {
    const repeatableJobKey = {
      name: 'repeating-task', // The name of the job
      pattern: '0 * * * *', // The cron pattern used to schedule the job
    };

    try {
      await this.taskQueue.removeRepeatable(repeatableJobKey.name, {
        pattern: repeatableJobKey.pattern,
      });

      console.log('Repeating job removed successfully');
    } catch (error) {
      console.error('Error removing repeating job:', error.message);
    }
  }

  async scheduleTokenRefresh(
    refreshToken: string,
    clientId: string,
    clientSecret: string,
  ) {
    const delay = 24 * 60 * 60 * 1000 - 5 * 60 * 1000; // Schedule 5 minutes before expiration (24h lifespan)
    // const delay = 60 * 60 * 1000 - 55 * 60 * 1000; // Schedule 5 minutes before expiration (test lifespan)

    await this.taskQueue.add(
      'refresh-token',
      { refreshToken, clientId, clientSecret },
      {
        repeat: { every: delay }, // Repeat the job daily
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );
  }

  async sendEmailBrevo(data: any) {
    await this.taskQueue.add('send-email-bravo', data);
  }

  async sendEmailVerificationMailViaBrevo(data: any) {
    await this.taskQueue.add('send-verification-email-bravo', data);
  }

  async sendAdvisoryRemarksEmailViaBrevo(data: any) {   
    try{
      await this.taskQueue.add('send-advisory-remarks-email-via-brevo', data);
    }catch(e){
      console.log("***************************The error with sending the email is", e)
    }

  }

  async sendSmsViaAfricasTalking(data: any) {
    await this.taskQueue.add('send-sms-africastalking', data);
  }
}
