import { Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { SCHEDULETIME } from './constant';
import * as schedule from 'node-schedule';

const logger = new Logger();

// 告警规则
export function startSchedule(
  cb,
  rule = `*/${SCHEDULETIME} * * * *`,
  name = 'front-end-scheduler',
) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  logger.log(`任务调度时间：${now}`);
  logger.log(`任务调度规则：${rule}`);
  // 创建定时任务
  schedule.scheduleJob(name, rule, function () {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    logger.log(`任务执行时间：${now}`);
    cb?.(dayjs());
  });
}

// 关闭定时器
export async function closeSchedule(name) {
  for (const i in schedule.scheduledJobs) {
    if (schedule.scheduledJobs[i].name.indexOf(name) > -1) {
      // console.log('closeSchedule', schedule.scheduledJobs[i].name)
      schedule.scheduledJobs[i].cancel();
    }
  }
}

// 获取定时器
export async function getSchedules() {
  // console.log('getSchedules', Object.keys(schedule.scheduledJobs))
  return Object.keys(schedule.scheduledJobs);
}
