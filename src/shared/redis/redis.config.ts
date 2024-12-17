export const redisOptions = process.env.REDISCLOUD_URL
  ? {
      url: process.env.REDISCLOUD_URL,
    }
  : {
      host: 'localhost',
      port: 6379,
    };
