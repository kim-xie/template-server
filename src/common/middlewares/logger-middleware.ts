import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonModule } from 'nest-winston';
import LoggerConfig from '../configs/logger.config';

export const logger = WinstonModule.createLogger(LoggerConfig);

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const code = res.statusCode; // 响应状态码
    // 组装日志信息
    const logFormat = `${req.method} ${req.originalUrl} ${
      req.ip
    } query:${JSON.stringify(req.query)} params:${JSON.stringify(
      req.params,
    )} body:${JSON.stringify(req.body)} code:${code}`;
    // const logFormat = `Method: ${req.method} \n Request original url: ${req.originalUrl} \n IP: ${req.ip} \n Status code: ${code} \n`;
    // 根据状态码，进行日志类型区分
    if (code >= 500) {
      logger.error(logFormat);
    } else if (code >= 400) {
      logger.warn(logFormat);
    } else {
      logger.log(logFormat);
    }
    next();
  }
}
