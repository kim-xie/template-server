const axios = require('axios');
const debug = require('debug')('ctrip-apollo-client');
const set = require('set-value');
const get = require('get-value');
const fs = require('fs');
const path = require('path');
const internalIp = require('internal-ip');
const crypto = require('crypto');

const logPreStr = 'apollo-client: ';
const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
const reject = (ms: number) =>
  new Promise<void>((_, reject) =>
    setTimeout(() => reject(new Error('request time out')), ms),
  );

interface ConfigOption {
  metaServerUrl?: string;
  configServerUrl?: string;
  appId: string;
  clusterName?: string;
  namespaceList?: string[];
  accessKey?: string;
  configPath?: string;
  initTimeoutMs?: number;
  onChange?: (config: any) => void;
  logger?: any;
}

interface Notification {
  namespaceName: string;
  notificationId: number;
}

interface ConfigResponse {
  configurations: Record<string, any>;
  releaseKey?: string;
}

class Client {
  private isPoll: boolean;
  private initTimeoutMs: number;
  private onPolling?: (config: any) => void;
  private apolloConfig: Record<string, any>;
  private configServerUrl: string;
  private metaServerUrl?: string;
  private appId: string;
  private clusterName: string;
  private namespaceList: string[];
  private info: (arg) => void;
  private error: (arg) => void;
  private accessKey?: string;
  private configPath: string;
  private notifications: Record<string, number>;
  private clientIp?: string;
  private readyPromise: Promise<void>;
  private resolve?: () => void;
  private reject?: (error: any) => void;

  constructor(option: ConfigOption) {
    const {
      metaServerUrl,
      configServerUrl,
      appId,
      clusterName,
      namespaceList,
      accessKey,
      configPath,
      initTimeoutMs,
      onChange,
      logger,
    } = option;

    if (!metaServerUrl && !configServerUrl) {
      throw new Error('configServerUrl and metaServerUrl can not all be empty');
    }

    this.isPoll = true;
    this.initTimeoutMs = initTimeoutMs || 10000;
    this.onPolling = onChange;
    this.apolloConfig = {};
    this.configServerUrl = configServerUrl!;
    this.metaServerUrl = metaServerUrl;
    this.appId = appId;
    this.clusterName = clusterName || 'cluster';
    this.namespaceList = namespaceList || ['application'];
    this.accessKey = accessKey || '';
    this.configPath = configPath || './config/apolloConfig.json';
    this.notifications = {};
    internalIp.v4().then((clientIp) => {
      this.clientIp = clientIp;
    });

    this.info = (...args) => {
      debug(logPreStr, ...args);
      logger?.info(logPreStr + args.join(' '));
    };
    this.error = (...args) => {
      debug(logPreStr, ...args);
      logger?.error(logPreStr + args.join(' '));
    };

    this.readyPromise = new Promise<void>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    this.namespaceList.forEach((item) => {
      this.notifications[item] = -1;
    });

    setImmediate(() => {
      this.polling();
    });

    global._apollo = this;

    this.init();
  }

  private async refreshServerUrl() {
    if (!this.metaServerUrl) {
      return;
    }
    try {
      const { data } = await axios.get(`${this.metaServerUrl}/services/config`);
      const len = data.length - 1;
      const seed = Math.floor(Math.random() * len);
      const url = data[seed].homepageUrl;
      this.configServerUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    } catch (error) {
      debug('refreshServerUrl error: ', error);
    }
  }

  public stop() {
    this.isPoll = false;
  }

  public ready() {
    return this.readyPromise;
  }

  private async polling() {
    let pollingCount = 1;

    while (this.isPoll) {
      debug('polling count:', pollingCount++);
      await this.refreshServerUrl();
      try {
        await this.pollingNotification();
      } catch (error) {
        debug('polling error:', error);
        await sleep(1000);
      }
    }
  }

  private async fetchConfigFromCache() {
    const urlList: { namespace: string; url: string }[] = [];
    const config: Record<string, ConfigResponse> = {};

    this.namespaceList.forEach((namespace) => {
      const url = `${this.configServerUrl}/configfiles/json/${this.appId}/${this.clusterName}/${namespace}?ip=${this.clientIp}`;
      urlList.push({ namespace, url });
    });

    for (const item of urlList) {
      try {
        const res: any = await axios.get(item.url, {
          headers: this.genAuthHeaders(item.url, this.accessKey),
        });
        config[item.namespace] = res.data;
      } catch (error) {
        debug('fetchConfigFromCache error:', error);
      }
    }
  }

  private async fetchConfigFromDbByNamespace(namespace: string) {
    const config = this.getConfigs();
    const releaseKey = config[namespace]?.releaseKey;
    const url = `${this.configServerUrl}/configs/${this.appId}/${this.clusterName}/${namespace}?releaseKey=${releaseKey}&ip=${this.clientIp}`;

    try {
      const res: any = await axios.get(url, {
        headers: this.genAuthHeaders(url, this.accessKey),
      });
      config[namespace] = res.data;
    } catch (error) {
      if (+get(error, 'response.status') === 304) {
        return;
      }
      debug('fetchConfigFromDbByNamespace error:', error.message, url);
    }

    this.saveConfigsToFile(config);
  }

  private async fetchConfigFromDb() {
    const urlList: { namespace: string; url: string }[] = [];
    const config: Record<string, ConfigResponse> = {};

    this.namespaceList.forEach((namespace) => {
      const url = `${this.configServerUrl}/configs/${this.appId}/${this.clusterName}/${namespace}?ip=${this.clientIp}`;
      urlList.push({ namespace, url });
    });

    for (const item of urlList) {
      try {
        const res: any = await axios.get(item.url, {
          headers: this.genAuthHeaders(item.url, this.accessKey),
        });
        config[item.namespace] = res.data;
      } catch (error) {
        debug('fetchConfigFromDb error:', error.message);
        throw new Error(
          `fetchConfigFromDb error: ${error.message} url:${item.url}`,
        );
      }
    }

    this.saveConfigsToFile(config);
  }

  private async pollingNotification() {
    debug('pollingNotification start');
    const notifications = JSON.stringify(
      Object.keys(this.notifications).map((namespace) => ({
        namespaceName: namespace,
        notificationId: this.notifications[namespace],
      })),
    );

    const notificationsEncode = encodeURIComponent(notifications);
    const url = `${this.configServerUrl}/notifications/v2?appId=${this.appId}&cluster=${this.clusterName}&notifications=${notificationsEncode}`;

    try {
      const res = await axios.get(url, {
        headers: this.genAuthHeaders(url, this.accessKey),
      });
      const data: Notification[] = res.data;

      if (data) {
        for (const item of data) {
          await this.fetchConfigFromDbByNamespace(item.namespaceName);
          this.notifications[item.namespaceName] = item.notificationId;
        }
      }
    } catch (error) {
      if (+get(error, 'response.status') === 304) {
        return;
      }
      debug('pollingNotification error: ', error.message, url);
      throw error;
    }
  }

  private saveConfigsToFile(configObj: Record<string, any>) {
    const configPath = this.configPath;
    const dirStr = path.dirname(configPath);

    if (!fs.existsSync(dirStr)) {
      fs.mkdirSync(dirStr, { recursive: true });
    }

    debug('map config begin');
    for (const namespace of Object.keys(configObj)) {
      const configurations = configObj[namespace].configurations;
      const keys = Object.keys(configurations);
      for (const key of keys) {
        if (/\./.test(key)) {
          set(configurations, key, configurations[key]);
          delete configurations[key];
        }
      }
    }

    this.apolloConfig = configObj;
    debug('map config end');
    this.onPolling && this.onPolling(configObj);
    debug('write apollo config File Sync begin');
    fs.writeFileSync(configPath, JSON.stringify(configObj));
    debug('write apollo config File Sync end');
  }

  private readConfigsFromFile() {
    const configPath = this.configPath;
    if (!fs.existsSync(configPath)) {
      return {};
    }

    const fileBuf = fs.readFileSync(configPath);
    if (fileBuf.length <= 0) {
      throw new Error('拉取本地文件错误');
    }

    const configStr = fileBuf.toString();
    return JSON.parse(configStr);
  }

  public getConfigs() {
    debug('getConfigs: ', JSON.stringify(this.apolloConfig));
    return this.apolloConfig;
  }

  public onChange(cb: (config: any) => void) {
    this.onPolling = cb;
  }

  public getValue(field: string, namespace: string = 'application') {
    const [key, defaultValue] = field.split(':');
    if (!this.apolloConfig[namespace]) {
      return defaultValue;
    }
    const configurations = this.apolloConfig[namespace]?.configurations;
    const data = get(configurations, key);

    return data || defaultValue;
  }

  public hotValue(field: string, namespace: string = 'application') {
    return new (class Value {
      get value() {
        return global._apollo.getValue(field, namespace);
      }
    })();
  }

  public withValue(
    target: any,
    key: string,
    field: string,
    namespace: string = 'application',
  ) {
    if (delete target[key]) {
      Object.defineProperty(target, key, {
        get: () => global._apollo.getValue(field, namespace),
        set: () => global._apollo.getValue(field, namespace),
        enumerable: true,
        configurable: true,
      });
    }
  }

  public static value(field: string, namespace?: string) {
    return function (target: any, key: string) {
      delete target[key];
      Object.defineProperty(target, key, {
        get: function () {
          return global._apollo.getValue(field, namespace);
        },
        enumerable: true,
        configurable: true,
      });
    };
  }

  public static hotValue(field: string, namespace: string = 'application') {
    return global._apollo.hotValue(field, namespace);
  }

  public static withValue(
    target: any,
    key: string,
    field: string,
    namespace: string = 'application',
  ) {
    return global._apollo.withValue(target, key, field, namespace);
  }

  private genAuthHeaders(reqUrl: string, secret?: string) {
    const Timestamp = Date.now();
    const Authorization = this.genSignature(reqUrl, Timestamp, secret!);
    return secret
      ? {
          Authorization,
          Timestamp,
        }
      : {};
  }

  private genSignature(url: string, timestamp: number, secret: string) {
    const hmac = crypto.createHmac('sha1', secret);
    const signature = hmac
      .update(`${timestamp}\n${this.url2PathWithQuery(url)}`)
      .digest()
      .toString('base64');
    return `Apollo ${this.appId}:${signature}`;
  }

  private url2PathWithQuery(urlString: string) {
    const url = new URL(urlString);
    const path = url.pathname;
    const query = url.search;
    let pathWithQuery = path;
    if (query && query.length > 0) pathWithQuery += query;
    return pathWithQuery;
  }

  async init(initTimeoutMs?: number) {
    try {
      await this.refreshServerUrl();
      const ip = await internalIp.v4();
      this.clientIp = ip;

      await Promise.race([
        this.fetchConfigFromDb(),
        reject(initTimeoutMs || this.initTimeoutMs),
      ]);
      this.resolve && this.resolve();
    } catch (error) {
      debug('error', error);
      this.reject && this.reject(error);
      this.apolloConfig = this.readConfigsFromFile();
    }
  }
}

export const ApolloClient = Client;
export const value = Client.value;
export const hotValue = Client.hotValue;
export const withValue = Client.withValue;
