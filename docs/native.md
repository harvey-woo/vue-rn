# Native 渲染

## 渲染原理

`@cat5th/vue-rn` 是一个 Vue 3 **自定义渲染器**，渲染链路为：

```
Vue 组件 (SFC)
  → createRenderer 生成的 VNode 树
  → @rasenjs/rn-dom 的 DOM 抽象（RNNode）
  → React Native Fabric 原生节点（RCTView / RCTText / ...）
```

- Vue 负责状态管理与响应式（`ref`、`reactive`、`computed`）
- `@rasenjs/rn-dom` 提供 DOM 风格的节点操作与事件系统
- 最终由 Fabric 渲染为真正的原生视图

与应用最接近的部分是入口：用 `createApp` 创建应用，再用 `register` 注册为 RN 的启动入口。

## createApp

与标准 Vue 3 应用创建方式一致，但挂载点是 RN 文档对象而非 DOM 元素。

```ts
import { createApp } from '@cat5th/vue-rn'
import App from './App.vue'

createApp(App).mount(doc.body)
```

> 完整方法签名见 [API 参考](./api.md#cat5thvue-rn)。

### register — Native 入口

对于真正在 RN 环境中运行的应用，使用 `register()` 方法将应用注册为 RN 的 `Runnable`：

```ts
createApp(App).register('MyApp')
```

### getOrCreateDocument

获取或创建与 `rootTag` 关联的 RN 文档对象。用于在 `registerRunnable` 回调中手动管理：

```ts
import { createApp, getOrCreateDocument } from '@cat5th/vue-rn'
import { AppRegistry } from 'react-native'

AppRegistry.registerRunnable('MyApp', ({ rootTag }) => {
  const doc = getOrCreateDocument(rootTag)
  createApp(App).mount(doc.body)
})
```

## CSS Modules

使用 `<style module>` 和 `useStyleModule()`：

```vue
<script setup lang="ts">
import { useStyleModule } from '@cat5th/vue-rn'
const style = useStyleModule()
</script>

<template>
  <View :style="style.card">
    <Text :style="style.title">Hello</Text>
  </View>
</template>

<style module>
.card {
  background-color: #1a1a2e;
  border-radius: 12px;
  padding: 16px;
}
.title {
  font-size: 18px;
  color: #e0e0ee;
}
</style>
```

## 样式处理

- `style` 属性：直接传入 RN style 对象，与标准 RN 用法一致
- `class` 属性：在 Native 中需要通过 Metro transformer 的 CSS 解析器支持（见 [Transformer 文档](./transformer.md)）
- `<style module>`：编译为 RN style 对象

---

## 下一步

- [路由集成](./router.md) — 多页面导航
- [Metro Transformer](./transformer.md) — CSS 工具类与 HMR
- [API 参考](./api.md) — 完整方法签名
