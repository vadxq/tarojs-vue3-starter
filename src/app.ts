import { ConfigProvider } from '@nutui/nutui-taro';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import '@nutui/touch-emulator';

import './app.css';

const App = createApp({
  onShow(_options) {
    console.log('App onShow.');
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
});

App.use(createPinia());
App.use(ConfigProvider);

export default App;
