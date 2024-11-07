import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PesapalToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers.pesapal_authorization;
  },
);

export const WebexToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers.webex_authorization;
  },
);
