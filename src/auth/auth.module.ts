import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactPerson } from 'src/contact-person/entities/contact-person.entity';
import { BullModule } from '@nestjs/bullmq';
import { TaskService } from '../shared/bullmq/task.service';
import { Queue } from 'bullmq';
import { redisOptions } from '../shared/redis/redis.config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([ContactPerson]),
    BullModule.registerQueue({
      name: 'task-queue',
      connection: redisOptions,
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    TaskService,
    {
      provide: 'TASK_QUEUE',
      useFactory: (queue: Queue) => queue,
      inject: ['BullQueue_task-queue'],
    },
  ],
  controllers: [AuthController],
  exports: [TaskService],
})
export class AuthModule {}
