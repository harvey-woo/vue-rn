# 入门指南

## 环境要求

- Node.js >= 22.11.0
- React Native 0.86+
- iOS: Xcode 16+
- Android: Android Studio / Gradle

## 安装

```bash
npm install @cat5th/vue-rn @rasenjs/rn-dom vue vue-router
```

或使用 yarn：

```bash
yarn add @cat5th/vue-rn @rasenjs/rn-dom vue vue-router
```

## 创建项目

### 1. 初始化 React Native 项目

```bash
npx @react-native-community/cli init MyApp --version 0.86.0
cd MyApp
```

### 2. 安装依赖

```bash
npm install @cat5th/vue-rn @rasenjs/rn-dom vue vue-router
npm install --save-dev @vue/compiler-sfc
```

### 3. 配置 Metro

修改 `metro.config.js`，添加 `.vue` 文件支持和 Vue SFC transformer：

```js
const path = require('path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

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

### 4. 添加 TypeScript 声明

在 `env.d.ts` 中添加 RN 内置组件的类型声明：

```ts
/// <reference path="node_modules/@cat5th/vue-rn/tags.d.ts" />
```

### 5. 创建入口文件

```ts
// index.ts
import { createApp } from '@cat5th/vue-rn'
import App from './App.vue'
import { name as appName } from './app.json'

createApp(App).register(appName)
```

### 6. 编写第一个组件

```vue
<!-- App.vue -->
<template>
  <View :style="{ flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', alignItems: 'center' }">
    <Text :style="{ color: '#16c79a', fontSize: 24 }">
      你好，Vue 3 + React Native！
    </Text>
  </View>
</template>
```

### 7. 运行

```bash
npx react-native run-ios
# 或
npx react-native run-android
```

### 开发体验：HMR 热更新

修改 `.vue` 文件后自动热替换，组件状态（`ref`、`reactive` 等）保持不丢失。Metro 终端会显示 `[HMR] Updated modules: 1` 日志。

> 如果 HMR 不生效，请参考 [Transformer 文档](./transformer.md)。

