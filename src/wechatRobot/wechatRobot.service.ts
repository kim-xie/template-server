import { Injectable, Logger } from '@nestjs/common';
import { WechatferryAgent } from '@wechatferry/agent';
/**
 * 微信机器人 官网：https://wcferry.netlify.app/
 * pnpm add -D @wechatferry/agent
 */
@Injectable()
export class WechatRobotService {
  private readonly logger = new Logger(WechatRobotService.name);

  private readonly wechatAgent = null;
  constructor() {
    // 创建 agent 实例
    this.wechatAgent = new WechatferryAgent();

    // 监听微信消息
    this.wechatAgent.on('message', (msg) => {
      this.receiveMessage(msg);
    });
  }

  // 启动
  async start() {
    const result = await this.wechatAgent?.start();
    this.logger.log(`微信机器人启动结果：${result}`);
    if (!result) {
      this.logger.error(`微信机器人启动异常`);
      return {
        code: 500,
        message: '微信机器人启动异常',
      };
    } else {
      return result;
    }
  }

  // 停止
  async stop() {
    const result = await this.wechatAgent?.stop();
    if (!result) {
      this.logger.error(`微信机器人关闭异常`);
      return {
        code: 500,
        message: '微信机器人关闭异常',
      };
    } else {
      return result;
    }
  }

  // 发送消息
  async sendMessage({ who, msg, mentionIdList = [], type = 'text' }) {
    if (!this.wechatAgent) {
      this.logger.error(`微信机器人暂未启动`);
      return;
    }
    const conversationId = who;
    try {
      switch (type) {
        case 'text':
          // 文本消息类型
          this.wechatAgent.sendText(conversationId, msg, mentionIdList);
          break;
        case 'richText':
          // 富文本消息类型
          this.wechatAgent.sendRichText(conversationId, msg);
          break;
        case 'file':
          // 文件消息类型
          this.wechatAgent.sendFile(conversationId, msg);
          break;
        case 'image':
          // 图片消息类型
          this.wechatAgent.sendImage(conversationId, msg);
          break;
        case 'xml':
          // XML消息类型
          this.wechatAgent.sendXml(conversationId, msg);
          break;
        default:
          // 文本消息类型
          this.wechatAgent.sendText(conversationId, msg, mentionIdList);
          break;
      }
    } catch (error) {
      this.logger.error(`微信机器人发送消息异常：${error}`);
    }
  }

  // 接收消息
  async receiveMessage(msg) {
    // 消息分类处理
    this.logger.log(`微信机器人接收消息：${JSON.stringify(msg)}`);
    return msg;
  }

  // 获取联系人信息
  async getContactInfo(userName) {
    if (!this.wechatAgent) {
      this.logger.error(`微信机器人暂未启动`);
      return;
    }
    try {
      const contactInfo = await this.wechatAgent.getContactInfo(userName);
      this.logger.log(`微信机器人联系人信息：${contactInfo}`);
      return contactInfo;
    } catch (error) {
      this.logger.error(`微信机器人获取联系人信息异常：${error}`);
    }
  }
}
