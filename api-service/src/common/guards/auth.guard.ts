import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private _: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const [email, password] = Buffer.from(token, 'base64')
        .toString()
        .split(':');

      const user = await this.prisma.user.findFirst({
        where: {
          email,
          password,
        },
      });

      if (user === null) {
        throw Error();
      }

      request.user = user;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];

    return type === 'Basic' ? token : undefined;
  }
}
