import { Injectable, Inject, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);
  constructor() {}
  use(req: Request, res: Response, next: NextFunction) {
    // 获取请求信息
    const { query, headers, url, method, body, params, connection } = req;

    // 获取 IP
    const xRealIp = headers['X-Real-IP'];
    const xForwardedFor = headers['X-Forwarded-For'];
    const { ip: cIp } = req;
    const { remoteAddress } = connection || {};
    const ip = xRealIp || xForwardedFor || cIp || remoteAddress;

    const code = res.statusCode; // 响应状态码
    // 组装日志信息
    const logFormat = `${method} ${url} ${
      ip
    } query:${JSON.stringify(query)} params:${JSON.stringify(
      params,
    )} body:${JSON.stringify(body)} code:${code}`;
    // 根据状态码，进行日志类型区分
    if (code >= 500) {
      this.logger.error(logFormat);
    } else if (code >= 400) {
      this.logger.warn(logFormat);
    } else {
      this.logger.log(logFormat);
    }
    next();
  }
}
