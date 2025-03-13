import type { UserConfigExport } from '@tarojs/cli';

export default {
  // plugins: ["@tarojs/plugin-vue-devtools"], // 有bug
  mini: {},
  h5: {},
} satisfies UserConfigExport<'vite'>;
