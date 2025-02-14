import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';
import { sendFeiShuMessageBySpider, config } from '@src/utils/feishu';

@Injectable()
export class SpiderService {
  private readonly logger = new Logger(SpiderService.name);
  private limit = 3;
  private crawler;
  private subscribeInitList = {
    jueJinHotNewsUrl: 'https://juejin.cn/hot/articles',
    jueJinNewsUrl: 'https://juejin.cn/recommended?sort=newest',
    jianshuUrl: 'https://www.jianshu.com/techareas/frontend',
    sifouUrl: 'https://segmentfault.com/blogs/newest',
    weixinUrl: 'https://www.gsdata.cn/rank/wxarc',
    csdnUrl: 'https://blog.csdn.net/nav/web',
    w3cUrl: 'https://www.w3ctech.com/topic/index',
  };
  private subscribeList = { ...this.subscribeInitList };
  private robot = config.feishu_kim_test;
  private w3cNews = '';
  private jueJinHotNews = '';
  private jueJinNews = '';
  private jianshuNews = '';
  private sifouNews = '';
  private weixinNews = '';
  private csdnNews = '';
  private keywords = [
    '前端',
    'h5',
    'css',
    'web',
    'cookie',
    'node',
    'nestjs',
    'vue',
    'docker',
    '鸿蒙',
    'harmony',
    '安卓',
    'android',
    'ios',
    'flutter',
    'ai',
    '人工智能',
    '全栈',
    '性能优化',
    '提升效率',
  ];
  constructor() {
    this.crawler = new PlaywrightCrawler({
      // 使用requestHandler来处理抓取的每个页面。
      requestHandler: async ({ request, page }) => {
        const {
          jueJinHotNewsUrl,
          jueJinNewsUrl,
          jianshuUrl,
          sifouUrl,
          weixinUrl,
          csdnUrl,
          w3cUrl,
        } = this.subscribeList;
        const url = request.loadedUrl;
        if (url === jueJinHotNewsUrl) {
          await this.handleJueJinHotNews(page);
        }
        if (url === jueJinNewsUrl) {
          await this.handleJueJinNews(page);
        }
        if (url === jianshuUrl) {
          await this.handleJianShuNews(page);
        }
        if (url === sifouUrl) {
          await this.handleSiFouNews(page);
        }
        // if (url === weixinUrl) {
        //   await this.handleWeixinNews(page);
        // }
        if (url === csdnUrl) {
          await this.handleCsdnNews(page);
        }
        // if (url === w3cUrl) {
        //   await this.handleW3CNews(page);
        // }
        // 关闭页面
        page.close();
        // 从当前页面提取链接, 并将它们添加到爬行队列中。
        // await enqueueLinks();
      },
      // 取消注释此选项以查看浏览器窗口。
      // headless: false,

      // 让我们限制爬取的范围，以缩短测试时间并提高安全性。
      maxRequestsPerCrawl: 50,
    });
  }

  /**
   * 消息格式化
   * @param msg
   * @returns
   */
  msg_format(msg) {
    if (!msg) {
      return;
    }
    const newsMsg = msg.filter((item) =>
      this.keywords.some((key) => item.title?.toLowerCase().includes(key)),
    );
    const limit_msg = newsMsg?.slice(0, this.limit);
    return limit_msg?.reduce((prev, item, _) => {
      prev += `[${item.title}](${item.url}) \n`;
      return prev;
    }, '');
  }

  // w3c
  async handleW3CNews(page) {
    await page.waitForSelector('.topic_list_content');
    const hotArticleList = await page.$$eval('.topic_list_content', (els) => {
      return els.map((el) => ({
        url: el.querySelector('.title')?.href,
        title: el.querySelector('.title')?.textContent.trim(),
        from: 'w3c',
      }));
    });

    this.logger.log(`w3c文章：${this.msg_format(hotArticleList)}`);

    this.w3cNews = `${this.msg_format(hotArticleList)}`;
  }

  // csdn 资讯
  async handleCsdnNews(page) {
    await page.waitForSelector('.Community-item');
    const hotArticleList = await page.$$eval('.Community-item', (els) => {
      return els.map((el) => ({
        url: el.querySelector('a')?.href,
        title: el.querySelector('.blog-text')?.textContent.trim(),
        from: 'csdn',
      }));
    });

    this.logger.log(`csdn文章：${this.msg_format(hotArticleList)}`);

    this.csdnNews = `${this.msg_format(hotArticleList)}`;
  }

  // 微信资讯
  async handleWeixinNews(page) {
    await page.waitForSelector('.tdhidden');
    const hotArticleList = await page.$$eval('.tdhidden', (els) => {
      return els.map((el) => ({
        url: el.querySelector('a')?.href,
        title: el.querySelector('a')?.textContent.trim(),
        from: '微信公众号',
      }));
    });

    this.logger.log(`微信公众号文章：${this.msg_format(hotArticleList)}`);

    this.weixinNews = `${this.msg_format(hotArticleList)}`;
  }

  // 思否资讯
  async handleSiFouNews(page) {
    await page.waitForSelector('.list-group-item');
    const hotArticleList = await page.$$eval('.list-group-item', (els) => {
      return els.map((el) => ({
        url: el?.querySelector('.title')?.href,
        title: el?.querySelector('.title')?.textContent.trim(),
        from: '思否',
      }));
    });

    this.logger.log(`思否文章：${this.msg_format(hotArticleList)}`);

    this.sifouNews = `${this.msg_format(hotArticleList)}`;
  }

  // 简述资讯
  async handleJianShuNews(page) {
    await page.waitForSelector('.title');
    const hotArticleList = await page.$$eval('.title', (els) => {
      return els.map((el) => ({
        url: el?.href,
        title: el?.textContent.trim(),
        from: '简书',
      }));
    });

    this.logger.log(`简书文章：${this.msg_format(hotArticleList)}`);
    this.jianshuNews = `${this.msg_format(hotArticleList)}`;
  }

  // 掘金热门文章
  async handleJueJinHotNews(page) {
    await page.waitForSelector('.article-item-link');
    const hotArticleList = await page.$$eval('.article-item-link', (els) => {
      return els.map((el) => ({
        url: el?.href,
        title: el.querySelector('.article-title')?.title,
        hot: Number(
          el.querySelector('.hot-number')?.textContent.trim().replace(/,/g, ''),
        ),
        from: '掘金',
      }));
    });

    this.logger.log(`掘金热门文章：${this.msg_format(hotArticleList)}`);

    this.jueJinHotNews = `${this.msg_format(hotArticleList)}`;
  }

  // 掘金综合文章
  async handleJueJinNews(page) {
    await page.waitForSelector('.content-main');
    const hotArticleList = await page.$$eval('.content-main', (els) => {
      return els.map((el) => ({
        url: el.querySelector('.title')?.href,
        title: el.querySelector('.title')?.title,
        hot: el.querySelector('.view')?.textContent.trim(),
        from: '掘金',
      }));
    });

    this.logger.log(`掘金综合文章：${this.msg_format(hotArticleList)}`);

    this.jueJinNews = `${this.msg_format(hotArticleList)}`;
  }

  // 爬虫信息
  async getSpiderNews(limit = this.limit, robot = this.robot) {
    if (limit) {
      this.limit = limit;
    }

    if (robot) {
      this.robot = robot;
    }
    await this.crawler.run(Object.values(this.subscribeList));

    // 发送通知
    this.sendMsgToFeishu(robot);
  }

  // 发送飞书消息
  async sendMsgToFeishu(robot) {
    const data = `${this.jueJinNews}\n${this.jueJinHotNews}\n${this.w3cNews}\n${this.sifouNews}\n${this.jianshuNews}\n${this.csdnNews}\n${this.weixinNews}`;
    await sendFeiShuMessageBySpider({
      title: '前端每日资讯',
      data,
      robot,
    });
  }

  /**
   * 获取爬虫关键词
   * @returns
   */
  getKeywords() {
    return this.keywords;
  }

  /**
   * 设置爬虫关键词
   * @param keyword
   * @returns
   */
  setKeywords(keyword) {
    if (keyword && typeof keyword === 'string') {
      const key = keyword.split(',');
      const newKey = key.filter(
        (newKey) =>
          !this.keywords.some((word) => newKey.toLowerCase() === word),
      );
      if (newKey?.length) {
        this.keywords = this.keywords.concat(
          newKey.map((key) => key.toLowerCase()),
        );
      }
    }
    return this.keywords;
  }

  /**
   * 删除爬虫关键词
   * @param keyword
   * @returns
   */
  delKeyword(keyword) {
    if (keyword && typeof keyword === 'string') {
      const key = keyword.split(',');
      this.keywords = this.keywords.filter(
        (newKey) => !key.some((word) => newKey.toLowerCase() === word),
      );
    }
    return this.keywords;
  }

  /**
   * 获取订阅列表
   * @returns
   */
  getSubscribes() {
    return this.subscribeList;
  }

  /**
   * 移除订阅
   * @returns
   */
  delSubscribes(subkKey) {
    const newList = Object.fromEntries(
      Object.entries(this.subscribeList).filter(([key]) => key !== subkKey),
    );
    this.subscribeList = newList;
    this.getSpiderNews();
    return this.subscribeList;
  }

  /**
   * 还原订阅
   * @returns
   */
  restoreSubscribes() {
    this.subscribeList = { ...this.subscribeInitList };
    return this.subscribeList;
  }
}
