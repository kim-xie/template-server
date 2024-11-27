// import { createInstance, webRequestAdapter } from '@ny/luban-ladder';
import axios from 'axios';

// 在线文档：https://docs.91160.com/luban/luban-ladder/docs/started/usage.html
// const instance: any = createInstance(webRequestAdapter, {
//   beforeRequest(config) {
//     // 请求拦截器
//     console.log('beforeRequest', config);
//   },
//   // 请求成功的回调函数
//   // 2xx 范围内的状态码都会触发该函数
//   onSuccess(response) {
//     const { config, data } = response;
//     console.log('onSuccess', config, data);
//   },
//   // 超出 2xx 范围的状态码都会触发该函数
//   onError(error) {
//     // 调用业务请求方法，即使状态码为 2xx，接口返回的数据不符合预期状态时，也会触发该函数
//     const { config, code, message, data } = error;
//     console.log('onError', config, code, message, data);
//   },
// });

const instance = axios;

export default instance;
