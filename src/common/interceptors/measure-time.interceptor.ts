import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MeasureTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const start = process.hrtime();
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      tap(() => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const time = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
        Logger.log(
          `${request.method} ${request.path} ${time}ms`,
          context.getClass().name,
        );
      }),
    );
  }
}
