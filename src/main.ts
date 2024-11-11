import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { CustomLogger } from './shared/utils/custom-logger.util';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error'], // Disable default logger
  });

  // config the documentation
  const config =new DocumentBuilder()
              .setTitle('Capital Connect')
              .setDescription('Backend API REST Endpoints Documentation')
              .setVersion('1.0.0')
              .build()
  const document =SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document)
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useLogger(app.get(CustomLogger));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
