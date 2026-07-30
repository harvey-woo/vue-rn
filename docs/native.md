# Native 渲染

## createApp

与标准 Vue 3 应用创建方式一致，但挂载点是 RN 文档对象而非 DOM 元素。

```ts
import { createApp } from '@cat5th/vue-rn'
import App from './App.vue'

createApp(App).mount(doc.body)
```

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

使用 `<style module>` 和 `useCssModule()`：

```vue
<script setup lang="ts">
import { useCssModule } from '@cat5th/vue-rn'
const style = useCssModule()
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
