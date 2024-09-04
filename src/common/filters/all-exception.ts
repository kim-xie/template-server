import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import * as StackTrace from 'stacktrace-js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // 如果有日志服务，可以在constructor,中挂载logger处理函数
  constructor(private readonly logger: Logger) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const msg = `${request.method} ${request.url} ${request.ip}
        Params: ${JSON.stringify(request.params)}
        Body: ${JSON.stringify(request.body)}
        Status code: ${status}
        Response: ${exception.toString()}
        `;
    this.logger.error(msg, StackTrace.get());
    response.status(status).json({
      statusCode: status,
      msg: `Service Error: ${exception}`,
    });
  }
}
