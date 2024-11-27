import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}
  use(req: Request, res: Response, next: NextFunction) {
    const logger = new Logger(LoggerMiddleware.name);

    // 获取请求信息
    const { query, headers, url, method, body, params, connection } = req;

    // 接收请求时长
    const startTime = Date.now();

    // 获取 IP
    const xRealIp = headers['X-Real-IP'];
    const xForwardedFor = headers['X-Forwarded-For'];
    const { ip: cIp } = req;
    const { remoteAddress } = connection || {};
    const ip = xRealIp || xForwardedFor || cIp || remoteAddress;

    res.on('finish', () => {
      const code = res.statusCode;
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // 组装日志信息
      const logFormat = `LoggerMiddleware: ${method} ${url} ${ip} Query: ${JSON.stringify(query)} Params: ${JSON.stringify(params)} Body: ${JSON.stringify(body)} Code: ${code} Spend: ${responseTime}ms`;

      // 根据状态码，进行日志类型区分
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      code >= 400 ? logger.error(logFormat) : logger.log(logFormat);
    });

    next();
  }
}
