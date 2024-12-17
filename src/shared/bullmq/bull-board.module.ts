import { Module } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';
import * as express from 'express';

@Module({})
export class BullBoardModule {
  private app = express();
  private adapter = new ExpressAdapter();

  constructor(private queue: Queue) {
    const { addQueue, setQueues, replaceQueues } = createBullBoard({
      queues: [new BullMQAdapter(queue)],
      serverAdapter: this.adapter,
    });

    this.adapter.setBasePath('/admin/queues');

    this.app.use('/admin/queues', this.adapter.getRouter());

    // Add middleware for authentication
    this.app.use('/admin/queues', (req, res, next) => {
      const auth = { login: 'admin', password: 'password' };
      const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
      const [login, password] = Buffer.from(b64auth, 'base64')
        .toString()
        .split(':');

      if (
        login &&
        password &&
        login === auth.login &&
        password === auth.password
      ) {
        return next();
      }
      res.set('WWW-Authenticate', 'Basic realm="401"');
      res.status(401).send('Authentication required.');
    });
  }
}
