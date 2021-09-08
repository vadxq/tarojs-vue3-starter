import Taro from '@tarojs/taro'
import { getApiUrl } from './utils'
import interceptors from './interceptors'

interceptors.forEach(interceptorItem => Taro.addInterceptor(interceptorItem))

/**
 * @description httpRequest，封装taro网络请求
 */
class httpRequest {
  baseOptions(params: any, method: keyof Taro.request.method | undefined = 'GET') {
    let { url, data } = params
    let contentType = 'application/json'
    contentType = params.contentType || contentType
    const option: Taro.request.Option<any> = {
      url: getApiUrl(url),
      data: data,
      method,
      header: {
        'content-type': contentType,
        'token': Taro.getStorageSync('token'),
        'clientType': 'web',
        'clientVersion': '0.0.1'
      }
    }
    return Taro.request(option);
  }

  get(url: string, data: any = '') {
    let option: any = { url, data }
    return this.baseOptions(option)
  }

  post(url: string, data: any, contentType?: string) {
    let params: any = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  }

  put(url: string, data: any = '') {
    let option: any = { url, data }
    return this.baseOptions(option, 'PUT')
  }

  delete(url: string, data: any = '') {
    let option: any = { url, data }
    return this.baseOptions(option, 'DELETE')
  }
}

export default new httpRequest()