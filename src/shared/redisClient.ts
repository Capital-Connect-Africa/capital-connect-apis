import Redis from 'ioredis';

const redisClient = new Redis({
  host: 'localhost', // Update with your Redis host
  port: 6379, // Update if using a different port
});

export default redisClient;
