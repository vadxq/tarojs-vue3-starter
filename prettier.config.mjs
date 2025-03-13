export default {
  printWidth: 180,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  bracketSameLine: true,
  trailingComma: 'es5',
  endOfLine: 'lf',

  plugins: ['prettier-plugin-tailwindcss'],
  // 添加 Tailwind 排序规则
  tailwindConfig: './tailwind.config.mjs',
  pluginSearchDependencies: true,
};
