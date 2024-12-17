import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { CustomLogger } from './shared/utils/custom-logger.util';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { redisOptions } from "./shared/redis/redis.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error'], // Disable default logger
  });

  // Create an Express server for BullBoard
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  // Initialize Bull Queues
  const queues = [
    new Queue('task-queue', { connection: redisOptions }),
    new Queue('email-queue', { connection: redisOptions}),
  ];

  // Create BullBoard
  createBullBoard({
    queues: queues.map((queue) => new BullMQAdapter(queue)),
    serverAdapter,
  });

  // Mount BullBoard at /admin/queues
  app.use('/admin/queues', serverAdapter.getRouter());

  // config the documentation
  const config = new DocumentBuilder()
    .setTitle('Capital Connect')
    .setDescription('Backend API REST Endpoints Documentation')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useLogger(app.get(CustomLogger));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
