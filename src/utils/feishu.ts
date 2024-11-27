import axios from 'axios';

// 机器人KEY
export const config = {
  // 专用测试机器人
  feishu_kim_test: 'b3df86a3-cc34-4ef5-9485-50f2b7a8c8aa',
  // 飞书 - 前端资讯推送测试群
  feishu_frontend_test: '43e1801b-b3b7-4699-bee2-2d5af82f343e',
  // 飞书 - 大前端双周会
  feishu_frontend: '979c99ca-e91c-4dfc-ac05-3fa915fee8a0',
  // 飞书 - 前端技术交流
  feishu_frontend_jishu: 'e7dfd89b-3fe4-4c90-8eb6-bef297a2c6cf',
};

export function createFontTag(content, color = 'warning') {
  return `<font color="${color}">${content}</font>`;
}

export function createMentionedTag(reviews, mobileMap = {}) {
  if (!reviews.length) return '';

  const mobiles = reviews
    .map((name) => `<@${mobileMap[name] || name}>`)
    .join(' ');

  return mobiles;
}

export function sendFeiShuMarkDownMessage(content, header = {}, key = '') {
  const options = {
    url: `https://open.feishu.cn/open-apis/bot/v2/hook/${key}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      msg_type: 'interactive',
      card: {
        elements: [
          {
            tag: 'markdown',
            content: content,
            // 'content': '普通文本\n标准emoji 😁😢🌞💼🏆❌✅\n*斜体*\n**粗体**\n~~删除线~~\n[文字链接](https://)\n<at id=all></at>'
          },
        ],
        header: header,
      },
    },
  };
  axios.request(options);
}

export function sendFeiShuCardMessage(content, header = {}, key = '') {
  const options = {
    url: `https://open.feishu.cn/open-apis/bot/v2/hook/${key}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      msg_type: 'interactive',
      card: {
        elements: content,
        header: header,
      },
    },
  };

  axios.request(options);
}

export function sendFeiShuMessageBySpider({ title, robot, data }) {
  // 卡片格式
  const header = {
    template: 'blue',
    title: {
      content: title || `大前端技术资讯`,
    },
  };
  // 推送内容
  sendFeiShuMarkDownMessage(data, header, robot);
}
