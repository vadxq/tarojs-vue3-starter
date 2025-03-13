import Taro from '@tarojs/taro';
import { noIconToast } from '../util';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT';

interface RequestOptions extends Taro.request.Option {
  method?: HttpMethod;
  body?: any;
  timeout?: number;
}

// 自定义错误类型
class HttpError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public response?: Taro.request.SuccessCallbackResult<any>
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

class NetworkError extends Error {
  constructor(message: string = '网络连接异常') {
    super(message);
    this.name = 'NetworkError';
  }
}

class TimeoutError extends Error {
  constructor(message: string = '请求超时') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// 自定义响应类型
interface CustomResponse<T> extends Taro.request.SuccessCallbackResult {
  data: T;
}

// 请求拦截器类型
type RequestInterceptor = (options: RequestOptions) => RequestOptions | Promise<RequestOptions>;
// 响应拦截器类型
type ResponseInterceptor<T = any> = (response: CustomResponse<T>, options: RequestOptions) => any;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

// const baseUrl = process.env.TARO_APP_API_BASE_URL;

export const request = async <T = any>(options: RequestOptions): Promise<T> => {
  try {
    // 执行请求拦截器
    let processedOptions = options;
    for (const interceptor of requestInterceptors) {
      processedOptions = await interceptor(processedOptions);
    }

    const newOptions: RequestOptions = {
      method: 'GET',
      timeout: 25000, // 默认25秒超时
      ...processedOptions,
      header: {
        'Content-Type': 'application/json',
        ...processedOptions.header,
      },
      url: `${process.env.TARO_APP_API_BASE_URL}${processedOptions.url}`,
    };

    // 处理不同方法的请求头
    if (['POST', 'PUT'].includes(newOptions.method!)) {
      if (!(newOptions.body instanceof FormData)) {
        newOptions.header = {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          ...newOptions.header,
        };
      } else {
        newOptions.header = {
          Accept: 'application/json',
          ...newOptions.header,
        };
        delete newOptions.header['Content-Type'];
      }
    } else {
      newOptions.header = {
        'Content-Type': 'json',
        ...newOptions.header,
      };
    }

    // 超时处理
    let timeoutTimer: any;
    let requestTask: Taro.RequestTask<any>;

    const response = await new Promise<CustomResponse<T>>((resolve, reject) => {
      requestTask = Taro.request({
        ...newOptions,
        data: newOptions.body || newOptions.data,
        success: (res) => resolve(res as CustomResponse<T>),
        fail: (err) => reject(err),
      });

      if (newOptions.timeout) {
        timeoutTimer = setTimeout(() => {
          requestTask.abort(); // 直接调用实例的abort方法
          reject(new TimeoutError());
        }, newOptions.timeout);
      }
    })
      .catch((err) => {
        // 网络错误处理
        if (err.errMsg?.includes('fail timeout')) {
          throw new TimeoutError();
        }
        if (err.errMsg?.includes('fail')) {
          throw new NetworkError(err.errMsg);
        }
        throw err;
      })
      .finally(() => {
        if (timeoutTimer) clearTimeout(timeoutTimer);
      });

    // 执行响应拦截器
    let processedResponse = response;
    for (const interceptor of responseInterceptors) {
      processedResponse = await interceptor(processedResponse, newOptions);
    }

    // 状态码处理
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return (processedResponse as CustomResponse<T>)?.data;
    }

    // 自定义HTTP错误
    const error = new HttpError(`请求失败，状态码：${response.statusCode}`, response.statusCode, response);

    // 记录错误日志
    console.error('API Error:', {
      url: newOptions.url,
      status: response.statusCode,
      error: response.data,
      options: newOptions,
    });

    throw error;
  } catch (error) {
    // 统一错误处理
    if (error instanceof HttpError) {
      // 业务逻辑错误处理
      console.error('HTTP Error:', error.message);
      noIconToast(error.message);
    } else if (error instanceof NetworkError) {
      // 网络错误处理
      console.error('Network Error:', error.message);
      noIconToast('网络连接失败，请检查网络');
    } else if (error instanceof TimeoutError) {
      // 超时处理
      console.error('Timeout Error:', error.message);
      noIconToast('请求超时，请重试');
    } else {
      // 未知错误
      console.error('Unknown Error:', error);
      noIconToast('系统异常，请联系管理员');
    }

    // 抛出错误供外部捕获
    throw error;
  }
};

// 添加拦截器示例
requestInterceptors.push((options) => {
  // 自动添加token
  const token = Taro.getStorageSync('token');
  if (token) {
    options.header = {
      ...options.header,
      Authorization: `${token}`,
    };
  }
  return options;
});

responseInterceptors.push((response) => {
  console.log(response);
  // 统一处理数据结构
  if (+response.data?.code !== 100000 && response.statusCode === 200) {
    noIconToast(response.data?.msg || '业务逻辑错误');
    return response;
    // throw new HttpError(response.data?.msg || '业务逻辑错误', response.data?.code, response);
  }
  return response;
});
