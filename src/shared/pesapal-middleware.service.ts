import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from './token.service';

@Injectable()
export class PesapalMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = await this.tokenService.getToken();
    req.headers['pesapal_authorization'] = token;
    next();
  }
}
