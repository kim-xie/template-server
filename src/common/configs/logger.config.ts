import { format, transports } from 'winston';
import type { WinstonModuleOptions } from 'nest-winston';
import 'winston-daily-rotate-file';

// 日志输出格式化
const customFormat = (showColor = false) =>
  format.combine(
    showColor
      ? format.colorize({
          level: true,
          message: true,
          colors: { info: 'green', error: 'red', warn: 'yellow' },
        })
      : format.uncolorize(),
    format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `[NestApp] ${process.pid} - ${timestamp} [${level}] ${message}`;
    }),
  );

// 日志分割默认参数
const dailyRotateDefaultOptions = {
  format: customFormat(),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

// winston 日志配置
const winstonLoggerConfig: WinstonModuleOptions = {
  exitOnError: false,
  format: customFormat(),
  transports: [
    new transports.Console({
      format: customFormat(true),
    }),
    new transports.DailyRotateFile({
      filename: 'logs/info-%DATE%.log',
      level: 'info',
      ...dailyRotateDefaultOptions,
    }),
    new transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      level: 'error',
      ...dailyRotateDefaultOptions,
    }),
  ],
};

export default winstonLoggerConfig;
