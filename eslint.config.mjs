import { FlatCompat } from '@eslint/eslintrc';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import vuePlugin from 'eslint-plugin-vue';
import importPlugin from 'eslint-plugin-import'; // 显式导入插件
import eslintPrettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// 获取当前模块路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {
    eslint: { plugins: { 'eslint-recommended': false } },
  },
});

// Prettier 配置
const prettierConfig = [
  {
    name: 'prettier',
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...eslintPrettierConfig.rules,
    },
  },
];

// 添加独立的 Vue Prettier 配置
const vuePrettierConfig = {
  files: ['**/*.vue'],
  plugins: {
    prettier: prettierPlugin,
  },
  ...compat.extends('plugin:prettier/recommended').find((c) => c.name === 'vue-prettier'),
  rules: {
    'prettier/prettier': 'warn', // 降级为警告避免冲突
  },
};

// Vue 配置
const vueConfig = {
  files: ['**/*.vue'],
  plugins: { vue: vuePlugin },
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: {
        ts: tsParser,
        js: '@babel/eslint-parser',
      },
      project: './tsconfig.json',
      extraFileExtensions: ['.vue'],
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  ...compat.extends('plugin:vue/vue3-recommended')[0],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/script-setup-uses-vars': 'error', // 启用 setup 语法校验
  },
};

// 独立 TypeScript 配置
const tsConfig = {
  name: 'ts-config',
  files: ['**/*.ts', '**/*.tsx'],
  plugins: {
    '@typescript-eslint': tsPlugin,
  },
  ...compat.extends('plugin:@typescript-eslint/recommended')[0],
  rules: {
    ...tsPlugin.configs.recommended.rules,
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_', // 允许 _ 开头的未使用参数
        varsIgnorePattern: '^_', // 允许 _ 开头的未使用变量
      },
    ],
  },
};

// Import 配置
const importConfig = {
  name: 'import-config',
  files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.vue'],
  plugins: {
    import: importPlugin,
  },
  rules: {
    ...importPlugin.configs.recommended.rules,
    'import/order': ['error', { alphabetize: { order: 'asc' } }],
  },
};

// 修正 Taro 配置
const taroBaseConfigs = compat.extends('taro/vue3').map((config) => ({
  ...config,
  plugins: {
    ...config.plugins,
    vue: vuePlugin,
  },
}));

const nodeConfig = {
  files: ['**/*.js'],
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
  },
};

export default [...taroBaseConfigs, nodeConfig, vueConfig, tsConfig, importConfig, vuePrettierConfig, ...prettierConfig];
