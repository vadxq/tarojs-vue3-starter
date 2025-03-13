import { showToast } from '@tarojs/taro';

export const noIconToast = (msg: string | object) => {
  if (!msg) {
    return;
  }
  showToast({
    title: typeof msg === 'object' ? JSON.stringify(msg) : msg,
    icon: 'none',
    duration: 3000,
  });
};
