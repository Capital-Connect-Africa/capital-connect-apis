import { Worker } from 'bullmq';
import { redisOptions } from '../redis/redis.config';

const taskWorker = new Worker(
  'task-queue',
  async (job) => {
    console.log(`Processing job ${job.id}:`, job.data);
    // Your job processing logic here
  },
  { connection: redisOptions },
);

export default taskWorker;
