import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [res] = context.getArgs();
    // 响应统一数据结构
    return next
      .handle()
      .pipe(
        map((data) => ({ data, code: res.statusCode || 0, message: 'ok' })),
      );
  }
}
