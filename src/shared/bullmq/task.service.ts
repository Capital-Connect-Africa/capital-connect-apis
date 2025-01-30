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
}
