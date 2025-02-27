import { Worker, Job } from 'bullmq';
import { redisOptions } from '../redis/redis.config';
import redisClient from '../redis/redisClient';
import axios from 'axios'; // Using axios directly for HTTP requests
import { WebexConfig } from '../webex.config';
import { NestFactory } from '@nestjs/core';
import { BullmqModule } from './bullmq.module';
import { BrevoService } from '../brevo.service';
import { OtpService } from '../../mobile/otp.service';

async function initializeWorker() {
  const appContext = await NestFactory.createApplicationContext(BullmqModule);
  const brevoService = appContext.get(BrevoService);
  const otpService = appContext.get(OtpService);

  const taskWorker = new Worker(
    'task-queue',
    async (job: Job) => {
      console.log(`Processing job ${job.id}:`, job.data);

      try {
        switch (job.name) {
          case 'refresh-token':
            await refreshToken();
            break;

          case 'send-email-bravo':
            await brevoService.sendEmailViaBrevo(
              job.data.msg,
              job.data.recipients,
            );
            break;

          case 'send-advisory-remarks-email-via-brevo':
            await brevoService.sendAdvisoryRemarksEmailViaBrevo(
              job.data.msg,
              job.data.user,
            );
            break;

          case 'send-verification-email-bravo':
            await brevoService.sendEmailVerificationMailViaBrevo(
              job.data.msg,
              job.data.user,
            );
            break;

          case 'send-verification-email-brevo':
            await brevoService.sendEmailVerificationMailViaBrevo(
              job.data.msg,
              job.data.user,
            );
            break;

          case 'send-sms-africastalking':
            await otpService.sendSmsViaAfricasTalking(
              job.data.mobileNumber,
              job.data.message,
            );
            break;

          default:
            throw new Error(`Unknown job name: ${job.name}`);
        }
      } catch (error) {
        console.error(`Job ${job.id} failed during processing:`, error.message);
        throw error; // This ensures the job is marked as failed
      }
    },
    {
      connection: redisOptions,
    },
  );

  taskWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
  });

  taskWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed: ${err.message}`);
  });
}

async function refreshToken() {
  const accessTokenKey = `accessToken`;
  const refreshTokenKey = `refreshToken`;
  const accessTokenExpiryKey = `accessTokenExpiry`;

  try {
    const refreshToken = await redisClient.get(refreshTokenKey);

    if (!refreshToken) {
      throw new Error('Refresh token not found in Redis.');
    }

    // Use axios for HTTP requests
    const response = await axios.post('https://webexapis.com/v1/access_token', {
      grant_type: 'refresh_token',
      client_id: WebexConfig.clientId,
      client_secret: WebexConfig.clientSecret,
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data.access_token;
    const newRefreshToken = response.data.refresh_token;
    const accessTokenExpiryTime = new Date(
      Date.now() + response.data.expires_in * 1000, // Convert to milliseconds
    );

    // Store new tokens and expiry times in Redis
    await redisClient.set(accessTokenKey, newAccessToken);
    await redisClient.set(refreshTokenKey, newRefreshToken);
    await redisClient.set(
      accessTokenExpiryKey,
      accessTokenExpiryTime.toISOString(),
    );

    console.log('Access token refreshed successfully.');
  } catch (error: any) {
    console.error(
      'Failed to refresh token:',
      error.response?.data || error.message,
    );
    throw new Error(
      `Token refresh failed: ${error.response?.data?.message || error.message}`,
    );
  }
}

initializeWorker().catch((error) => {
  console.error('Failed to initialize worker:', error.message);
});
