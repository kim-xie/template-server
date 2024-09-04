import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const defaultFormat = 'YYYY-MM-DD HH:mm:ss.SSS Z';

/**
 * 统一UTC 日期格式化
 * @param timestamp
 * @param format
 * @param utcOffset
 * @returns
 */
export const dateFormat = (
  timestamp: number,
  format?: string,
  utcOffset?: number,
) => {
  return dayjs(timestamp)
    .utcOffset(utcOffset || 8)
    .format(format || defaultFormat);
};

/**
 * 统一UTC 日期解析
 * @param date
 * @param format
 * @param utcOffset
 * @returns
 */
export const dateParse = (
  date: string,
  format?: string,
  utcOffset?: number,
) => {
  const dateFormatString = format || defaultFormat;
  let result = dayjs(date, { format: dateFormatString, utc: true });
  if (dateFormatString && !dateFormatString.includes('Z')) {
    result = result.subtract(utcOffset || 8, 'hours');
  }
  return result;
};

export type IDateUtil = 'ms' | 's' | 'm' | 'h' | 'd';

/**
 * 时间戳转换
 * @param dateUtil
 * @returns
 */
export const msofUtil = (dateUtil: IDateUtil): number => {
  const msMap = {
    ms: 1,
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
  };
  return msMap[dateUtil];
};

/**
 * 暴露原生能力
 */
export default dayjs;
