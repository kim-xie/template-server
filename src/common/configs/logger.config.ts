import { format, transports } from 'winston';
import { utilities } from 'nest-winston';
import 'winston-daily-rotate-file';

import type { WinstonModuleOptions } from 'nest-winston';

const customFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.align(),
  format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`),
  utilities.format.nestLike('template-server', {
    prettyPrint: true,
  }),
  format.uncolorize(),
);
const defaultOptions = {
  format: customFormat,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

const config: WinstonModuleOptions = {
  exitOnError: false,
  format: customFormat,
  transports: [
    new transports.Console({
      format: format.combine(format.colorize({ all: true })),
    }),
    new transports.DailyRotateFile({
      filename: 'logs/info-%DATE%.log',
      level: 'info',
      ...defaultOptions,
    }),
    new transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      level: 'error',
      ...defaultOptions,
    }),
  ],
};

export default config;
