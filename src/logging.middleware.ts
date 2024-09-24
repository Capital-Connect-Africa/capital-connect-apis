import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(@Inject('CustomLogger') private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    // Capture the original send function
    const originalSend = res.send;

    // Override the send function to capture the response body
    res.send = function (body) {
      res.locals.responseBody = body;
      return originalSend.apply(res, arguments);
    };

    res.on('finish', () => {
      const { statusCode } = res;
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (statusCode === 500) {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} - ${responseTime}ms`,
        );
      } else {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} - ${responseTime}ms`,
        );
      }
      if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        this.logger.log(`Request Body: ${JSON.stringify(req.body)}`);
      }
      if (process.env.LOG_RESPONSE_BODY === 'on')
        this.logger.log(
          `Response Body: ${JSON.stringify(res.locals.responseBody)}`,
        );
    });

    next();
  }
}
