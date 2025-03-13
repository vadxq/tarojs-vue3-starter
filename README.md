# tarojs多平台小程序

## 技术选型

- Tarojs4
- Vite
- Vue3
- Pinia
- TypeScript
- TailwindCSS
- NutUI

## 项目结构

```bash
.
├── config/                 # 构建配置
│   ├── dev.ts             # 开发环境配置
│   ├── prod.ts            # 生产环境配置
│   └── index.ts           # 主配置
├── src/
│   ├── app.ts             # 应用入口
│   ├── store/             # Pinia状态管理
│   ├── pages/             # 页面组件
│   └── components/        # 公共组件
├── types/                 # 类型声明
│   ├── components.d.ts    # 组件类型
│   └── vue.d.ts           # Vue扩展类型
├── .husky/                # Git钩子配置
│   ├── pre-commit         # 提交前检查
│   └── commit-msg         # 提交信息校验
├── .vscode/               # IDE配置
│   └── settings.json      # 编辑器统一配置
├── config/                # Taro构建配置
├── tailwind.config.mjs    # TailwindCSS配置
├── postcss.config.cjs     # PostCSS插件配置
├── babel.config.cjs       # Babel配置
├── tsconfig.json          # TypeScript配置
├── eslint.config.mjs      # ESLint配置
├── commitlint.config.cjs  # 提交信息规范
└── .editorconfig          # 编辑器风格统一
```

## 项目初始化

```bash
pnpm install
# or
bun install
```

## 项目运行

```bash
pnpm dev:weapp
# or
bun dev:weapp
```

## 项目构建

```bash
pnpm build:weapp
# or
bun build:weapp
```

## tips

- 微信开发者工具需要登录，才能下载基础库等
