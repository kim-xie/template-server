import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransformInterceptor.name);
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [req, res] = context.getArgs();
    this.logger.log(
      `${req.method} ${req.originalUrl} ${req.ip} query:${JSON.stringify(
        req.query,
      )} params:${JSON.stringify(req.params)} body:${JSON.stringify(
        req.body,
      )} code:${res.statusCode}`,
    );
    return next
      .handle()
      .pipe(map((data) => ({ data, code: 0, message: 'success' })));
  }
}
