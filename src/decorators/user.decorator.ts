import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserPayload } from '../user/interfaces/user.interface';

export const User = createParamDecorator(
  (_: any, ctx: ExecutionContext): UserPayload => {
    const ctxHttp = ctx.switchToHttp();
    const req = ctxHttp.getRequest();
    return req.user;
  },
);
