import path from 'node:path';

import NutUIResolver from '@nutui/auto-import-resolver';
import { defineConfig } from '@tarojs/cli';

import type { UserConfigExport } from '@tarojs/cli';
import tailwindcss from 'tailwindcss';

// eslint-disable-next-line import/no-unresolved
import ComponentsPlugin from 'unplugin-vue-components/vite';
import type { Plugin } from 'vite';
// eslint-disable-next-line import/no-unresolved
import { UnifiedViteWeappTailwindcssPlugin as uvtw } from 'weapp-tailwindcss/vite';

// eslint-disable-next-line import/no-unresolved
import devConfig from './dev';
// eslint-disable-next-line import/no-unresolved
import prodConfig from './prod';

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'vite'>(async (merge, _) => {
  const baseConfig: UserConfigExport<'vite'> = {
    plugins: ['@tarojs/plugin-html'],
    projectName: 'ttweb',
    date: '2025-3-12',
    designWidth(input) {
      // 配置 NutUI 375 尺寸
      if (typeof input === 'object' && input?.file && input.file.replace(/\\+/g, '/').includes('@nutui')) {
        return 375;
      }
      // 全局使用 Taro 默认的 750 尺寸
      return 750;
    },
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2,
      375: 2 / 1,
    },
    sourceRoot: 'src',
    outputRoot: `dist/${process.env.TARO_ENV}`,
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'vue3',
    compiler: {
      type: 'vite',
      vitePlugins: [
        {
          name: 'postcss-config-loader-plugin',
          config(config) {
            // 加载 tailwindcss
            if (typeof config.css?.postcss === 'object') {
              config.css?.postcss.plugins?.unshift(tailwindcss());
            }
          },
        },
        uvtw({
          // rem转rpx
          rem2rpx: true,
          // 除了小程序这些，其他平台都 disable
          disabled: process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'rn',
        }),
        ComponentsPlugin({
          resolvers: [NutUIResolver({ taro: true })],
          dts: 'types/components.d.ts',
        }),
      ] as Plugin[],
    },
    weapp: {
      module: {
        postcss: {
          autoprefixer: {
            enable: true,
          },
          // 小程序端样式引用本地资源内联配置
          url: {
            enable: true,
            config: {
              limit: 10240, // 文件大小限制
            },
          },
        },
      },
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css',
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      compile: {
        include: ['@nutui/nutui-taro', '@nutui/icons-vue-taro', 'nutui', 'nutui-taro', 'icons-vue-taro'],
      },

      esnextModules: ['nutui-taro', 'icons-vue-taro'],
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
    alias: {
      '~': path.resolve(__dirname, '..', 'src'),
    },
  };
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
