import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export interface UserPayload {
  userId: string;
  email: string;
}

export const GetUser = createParamDecorator(
  (
    data: keyof UserPayload | undefined,
    ctx: ExecutionContext,
  ): UserPayload | string | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request?.user as UserPayload | undefined;

    if (!user) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    return data ? user?.[data] : user;
  },
);
