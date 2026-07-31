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
无需 React 组件、JSX 或学习新的 API——用熟悉的 `createApp`、`<script setup>`、`ref` 即可。

---

## 特性

- **Vue 3 自定义渲染器** — 用熟悉的 `createApp`、`<script setup>`、`ref`/`reactive` 编写 RN 应用
- **React Native Fabric 原生渲染** — 通过 `@rasenjs/rn-dom` 直接操作 RN 原生节点
- **Vue Router 集成** — 内置 `RouterLink` 组件和 RN 适用的内存路由历史 `createRNHistory()`
- **`.vue` SFC 转换** — 一行 Metro 配置（`withVueRN` 插件），直接使用 `.vue` 文件
- **HMR 热更新** — 修改 `.vue` 文件自动热替换，组件状态保持不丢失
- **CSS 工具类支持** — 内置 Tailwind CSS v3/v4、UnoCSS 的 class-to-style 解析器
- **CSS Modules** — 支持 `<style module>` 转换为 RN style 对象
- **Web 兼容层** — 同一套组件可运行在浏览器（实验性）

---

## ⚡ 快速开始

> 完整步骤见 [入门指南](./docs/getting-started.md)。以下是一个可运行的最小闭环。

### 1. 安装

```bash
npm install @cat5th/vue-rn @rasenjs/rn-dom vue vue-router
```

### 2. 配置 Metro

```js
// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config')
const { withVueRN } = require('@cat5th/vue-rn/metro')

module.exports = withVueRN(getDefaultConfig(__dirname))
```

### 3. 添加类型声明

```ts
// env.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
```

> RN 组件类型自动注册，无需手动引用 `tags.d.ts`。

### 4. 创建入口

```ts
// index.ts
import { createApp } from '@cat5th/vue-rn'
import App from './App.vue'
import { name as appName } from './app.json'

createApp(App).register(appName)
```

### 5. 第一个组件

```vue
<!-- App.vue -->
<template>
  <View :style="{ flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', alignItems: 'center' }">
    <Text :style="{ color: '#16c79a', fontSize: 24, fontWeight: 'bold' }">
      Hello from Vue 3 + RN!
    </Text>
  </View>
</template>
```

### 6. 运行

```bash
npx react-native run-ios
# 或
npx react-native run-android
```

---

## 文档

| 文档 | 说明 |
|------|------|
| [📖 入门指南](./docs/getting-started.md) | 环境要求、完整安装与项目配置步骤 |
| [� 组件](./docs/components.md) | 内置组件、事件与类型说明 |
| [�🧭 路由集成](./docs/router.md) | vue-router 集成与 RouterLink 组件 |
| [🔧 Metro Transformer](./docs/transformer.md) | `withVueRN` 插件、CSS 工具类与 HMR |
| [📱 Native 渲染](./docs/native.md) | 渲染器原理与 `createApp` / `register` |
| [🌐 Web 兼容层](./docs/web.md) | 同一套组件运行在浏览器（实验性） |
| [📚 API 参考](./docs/api.md) | 完整的 API 文档 |

---

## 示例项目

完整可运行示例见 [`examples/vue-rn-test/`](./examples/vue-rn-test/)，包含：

- Native 应用入口（iOS + Android）
- Vue Router 集成
- Tailwind CSS 工具类使用
- CSS Modules 支持
- Todo 列表组件示例

```bash
cd examples/vue-rn-test
npm install
npx react-native run-ios
```

---

## License

MIT
