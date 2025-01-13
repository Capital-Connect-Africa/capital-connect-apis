import Redis from 'ioredis';
import * as process from 'node:process';

const redisClient = process.env.REDISCLOUD_URL
  ? new Redis(process.env.REDISCLOUD_URL)
  : new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

export default redisClient;
