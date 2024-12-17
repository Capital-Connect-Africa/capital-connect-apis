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
}
