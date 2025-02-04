import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class CatchInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      catchError((err: Error) => {
        let error;

        if (err instanceof HttpException) {
          error = err.getResponse();
        }

        if (err instanceof RpcException) {
          error = err.getError();
        }

        return of({
          status: 'error',
          error: error || err.message,
        });
      }),
    );
  }
}
