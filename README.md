<picture>
  <source media="(prefers-color-scheme: dark)" srcset="logo.png">
  <img alt="vue-rn" src="logo.png" width="120" height="120">
</picture>

# @cat5th/vue-rn

[![npm version](https://img.shields.io/npm/v/@cat5th/vue-rn?style=flat-square&logo=npm)](https://www.npmjs.com/package/@cat5th/vue-rn)
[![npm downloads](https://img.shields.io/npm/dm/@cat5th/vue-rn?style=flat-square)](https://www.npmjs.com/package/@cat5th/vue-rn)
[![GitHub stars](https://img.shields.io/github/stars/harvey-woo/vue-rn?style=flat-square&logo=github)](https://github.com/harvey-woo/vue-rn)
[![License](https://img.shields.io/github/license/harvey-woo/vue-rn?style=flat-square)](https://github.com/harvey-woo/vue-rn)
[![CI](https://img.shields.io/github/actions/workflow/status/harvey-woo/vue-rn/ci.yml?style=flat-square&logo=githubactions)](https://github.com/harvey-woo/vue-rn/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![iOS](https://img.shields.io/badge/iOS-supported-brightgreen?style=flat-square&logo=apple)](https://github.com/harvey-woo/vue-rn)
[![Android](https://img.shields.io/badge/Android-supported-brightgreen?style=flat-square&logo=android)](https://github.com/harvey-woo/vue-rn)

> 用 Vue 3 写 React Native 应用。

`@cat5th/vue-rn` 是 Vue 3 的**自定义渲染器**，将 Vue 渲染到 React Native Fabric。

---

## 特性

- **Vue 3 自定义渲染器** — 用熟悉的 `createApp`、`<script setup>`、`ref`/`reactive` 编写 RN 应用
- **React Native Fabric 原生渲染** — 通过 `@rasenjs/rn-dom` 直接操作 RN 原生节点
- **Vue Router 集成** — 内置 `RouterLink` 组件和 RN 适用的内存路由历史 `createRNHistory()`
- **`.vue` SFC 转换** — 自定义 Metro transformer，支持在 RN 项目中直接使用 `.vue` 文件
- **HMR 热更新** — 修改 `.vue` 文件自动热替换，组件状态保持不丢失
- **CSS 工具类支持** — 内置 Tailwind CSS v3/v4、UnoCSS 的 class-to-style 解析器，可在 `.vue` 模板中使用工具类
- **CSS Modules** — 支持 `<style module>` 转换为 RN style 对象

## 快速开始

```bash
npm install @cat5th/vue-rn @rasenjs/rn-dom vue vue-router
```

然后在 RN 入口中：

```ts
import { createApp } from '@cat5th/vue-rn'
import App from './App.vue'
import { name as appName } from './app.json'

createApp(App).register(appName)
```

---

## 文档

| 文档 | 说明 |
|------|------|
| [📖 入门指南](./docs/getting-started.md) | 环境要求、安装步骤、项目配置 |
| [📱 Native 渲染](./docs/native.md) | Vue 渲染到 React Native Fabric 的使用方式 |
| [🧭 路由集成](./docs/router.md) | vue-router 集成与 RouterLink 组件 |
| [🔧 Metro Transformer](./docs/transformer.md) | `.vue` 文件转换器配置与 CSS 工具类使用 |
| [📚 API 参考](./docs/api.md) | 完整的 API 文档 |

---

## 基本用法

### Native 应用

```ts
// index.ts — RN 入口
import { createApp } from '@cat5th/vue-rn'
import App from './App.vue'
import { router } from './router'

createApp(App)
  .use(router)
  .register('MyApp')
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
  <View :style="{ flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', alignItems: 'center' }">
    <Text :style="{ color: '#16c79a', fontSize: 24, fontWeight: 'bold' }">
      Hello from Vue 3 + RN!
    </Text>
  </View>
</template>
```

### 路由配置

```ts
// router.ts
import { createRouter } from 'vue-router'
import { createRNHistory } from '@cat5th/vue-rn/router'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

export const router = createRouter({
  history: createRNHistory(),
  routes,
})
```

### Metro 配置（Native 项目）

```js
// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const path = require('path')

const defaultConfig = getDefaultConfig(__dirname)

module.exports = mergeConfig(defaultConfig, {
  transformer: {
    babelTransformerPath: require.resolve('@cat5th/vue-rn/dist/transformer/index'),
  },
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'vue'],
  },
})
```

---

## 项目结构

```
@cat5th/vue-rn/
├── src/
│   ├── index.ts          # Vue 3 自定义渲染器核心
│   ├── router.ts         # vue-router 集成
│   ├── router-link.ts    # RN 版 RouterLink 组件
│   └── web/              # Web 兼容层（实验性，未充分测试）
├── transformer/
│   ├── index.ts          # Metro .vue 文件转换器
│   ├── style-collection.ts  # 运行时 class→style 查找
│   └── class-resolvers/  # CSS 工具类解析器
│       ├── plugins/
│       │   ├── tw-v3.ts  # Tailwind CSS v3
│       │   ├── tw-v4.ts  # Tailwind CSS v4
│       │   └── unocss.ts # UnoCSS
│       └── parse.ts      # CSS→RN style 属性映射
└── examples/
    └── vue-rn-test/      # 完整示例项目
```

---

## 示例项目

完整示例见 [`examples/vue-rn-test/`](./examples/vue-rn-test/)，包含：

- Native 应用入口（iOS + Android）
- Vue Router 集成
- Tailwind CSS 工具类使用
- CSS Modules 支持
- Todo 列表组件示例

---

## License

MIT
