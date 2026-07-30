# API 参考

## @cat5th/vue-rn

### createApp

创建 Vue 3 应用的 RN 入口。

```ts
import { createApp } from '@cat5th/vue-rn'

createApp(rootComponent)
```

**返回值** `VueRNMountable`

| 方法 | 说明 |
|------|------|
| `mount(container)` | 挂载到 RN 文档容器（通常是 `doc.body`） |
| `unmount()` | 卸载应用 |
| `use(plugin, ...options)` | 注册 Vue 插件（如 `vue-router`） |
| `register(appName, setup?)` | 注册为 RN `AppRegistry` 的 Runnable |

### getOrCreateDocument

获取或创建与 `rootTag` 关联的 `RNDocument` 实例。

```ts
import { getOrCreateDocument } from '@cat5th/vue-rn'

const doc = getOrCreateDocument(rootTag)
```

### useCssModule

获取当前组件的 CSS Module style 映射。

```ts
import { useCssModule } from '@cat5th/vue-rn'

const style = useCssModule()        // <style module>
const foo = useCssModule('foo')     // <style module="foo">
```

### RNDocument

`@rasenjs/rn-dom` 的文档对象，可直接创建元素：

```ts
import { RNDocument } from '@cat5th/vue-rn'

const doc = RNDocument.getOrCreate(rootTag)
doc.createElement('View')
doc.createTextNode('hello')
```

---

## @cat5th/vue-rn/router

### createRNHistory

创建 RN 适用的内存路由历史（`vue-router` 的 `createMemoryHistory` 的别名）。

```ts
import { createRNHistory } from '@cat5th/vue-rn/router'

const history = createRNHistory(base?: string)
```

### RouterLink

RN 兼容的导航链接组件。

```vue
<RouterLink to="/about" :style="{ color: '#16c79a' }">About</RouterLink>
```

---

## @cat5th/vue-rn/web

> ⚠️ **实验性**：Web 兼容层尚未经过充分测试，API 可能在未来版本中发生变化。

### createWebApp

创建 Web 平台应用的快捷入口。自动注入 CSS reset 并注册所有 RN 兼容组件。

```ts
import { createWebApp } from '@cat5th/vue-rn/web'

const app = createWebApp(App)
app.use(router).mount('#app')
```

### webPlugin

Vue 插件形式，可与其他插件组合使用：

```ts
import { createApp } from 'vue'
import { webPlugin } from '@cat5th/vue-rn/web'

createApp(App).use(webPlugin).mount('#app')
```

### StyleSheet

将 RN style 对象编译为原子 CSS 类。

```ts
import { StyleSheet } from '@cat5th/vue-rn/web'

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f0f1a' },
})

StyleSheet.resolve([styles.root, { opacity: 0.5 }])
// → ['r-1a', { opacity: '0.5' }]
```

### createElement

底层 VNode 工厂，处理 RN → DOM 属性映射。

```ts
import { createElement } from '@cat5th/vue-rn/web'

createElement('View', { style: { flex: 1 } }, children)
```

### 全局组件

通过 `createWebApp()` 或 `webPlugin` 注册的全局组件：

| 组件 | 说明 |
|------|------|
| `View` | 容器 |
| `Text` | 文本 |
| `Image` | 图片 |
| `TextInput` | 输入框 |
| `ScrollView` | 滚动容器 |
| `SafeAreaView` | 安全区域 |
| `Switch` | 开关 |
| `Pressable` | 可点击 |
| `ActivityIndicator` | 加载指示器 |
| `StatusBar` | 状态栏 |
| `KeyboardAvoidingView` | 键盘避让 |
| `ImageBackground` | 背景图 |
| `Button` | 按钮 |
| `CheckBox` | 复选框 |
| `ProgressBar` | 进度条 |
| `TouchableOpacity` | 透明度触摸 |
| `TouchableHighlight` | 高亮触摸 |
| `TouchableWithoutFeedback` | 无反馈触摸 |

### APIs

通过 `@cat5th/vue-rn/web` 导出：

```ts
import {
  Alert, Platform, Dimensions, PixelRatio,
  Linking, Clipboard, AppState, Share,
  useWindowDimensions, useColorScheme, useLocaleContext,
} from '@cat5th/vue-rn/web'
```

---

## @cat5th/vue-rn/dist/transformer

### Metro Transformer

路径：`@cat5th/vue-rn/dist/transformer/index`

用作 `metro.config.js` 中的 `babelTransformerPath`。

### StyleCollection

运行时 class → style 查找缓存。

```ts
import { StyleCollection } from '@cat5th/vue-rn/dist/transformer/style-collection'

StyleCollection.inject([['flex-1', { flex: 1 }]])
StyleCollection.get('flex-1')     // → { flex: 1 }
StyleCollection.reset()
```

### ClassResolver

```ts
import { use } from '@cat5th/vue-rn/dist/transformer/class-resolvers'

use({ name: 'custom', detect() { return true }, async resolve() { ... } })
```
