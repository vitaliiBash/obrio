import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

const getInstance = (dto: ClassConstructor, data: any) => {
  return plainToInstance(dto, data, { excludeExtraneousValues: true });
};

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(_: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((response: { data: any }) => {
        return {
          status: 'success',
          data: Array.isArray(response.data)
            ? response.data.map((d) => getInstance(this.dto, d))
            : getInstance(this.dto, response.data),
        };
      }),
    );
  }
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
