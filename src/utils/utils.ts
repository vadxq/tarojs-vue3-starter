import Taro from "@tarojs/taro";

/**
 * @description 获取当前页url
 */
export const getCurrentPageUrl = () => {
  let pages: any[] = Taro.getCurrentPages()
  let currentPage = pages[pages.length - 1]
  let url = currentPage.route
  return url
}

/**
 * @description 获取API URL前缀，根据环境进行判断
 */
export const getBaseUrl = (url: string) => {
  let BASE_URL: string = ''
  if (process.env.NODE_ENV === 'development') {
    // 开发环境 - 根据请求不同返回不同的BASE_URL
    if (url.includes('/api/')) {
      BASE_URL = 'https://api.vadxq.com'
    } else if (url.includes('/web-api/')) {
      BASE_URL = 'https://test-api.vadxq.com'
    } else {
      BASE_URL = 'https://api.vadxq.com'
    }
  } else {
    // 生产环境
    if (url.includes('/api/')) {
      BASE_URL = 'https://api.vadxq.com'
    } else if (url.includes('/web-api/')) {
      BASE_URL = 'https://api.vadxq.com'
    } else {
      BASE_URL = 'https://api.vadxq.com'
    }
    BASE_URL = BASE_URL.replace('http://', 'https://')
  }
  return BASE_URL
}

/**
 * @description 获取API URL，根据环境进行判断
 */
 export const getApiUrl = (originUrl: string) => {
  const baseUrl: string = getBaseUrl(originUrl)
  let url: string = originUrl
  if (process.env.NODE_ENV === 'development') {
    // 开发环境 - 根据请求不同返回不同的BASE_URL
    if (originUrl.includes('/api/')) {
      url = url.split('/api')[1]
    }
    if (originUrl.includes('/web-api/')) {
      url = url.split('/web-api')[1]
    }
  } else {
    // 生产环境
    if (originUrl.includes('/api/')) {
      url = url.split('/api')[1]
    }
    if (originUrl.includes('/web-api/')) {
      url = url.split('/web-api')[1]
    }
  }
  return baseUrl + url
}
