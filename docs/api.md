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

## @cat5th/vue-rn/metro

### withVueRN

Metro 配置插件，一行接入 `.vue` 支持与模块去重。

```js
const { getDefaultConfig } = require('@react-native/metro-config')
const { withVueRN } = require('@cat5th/vue-rn/metro')

module.exports = withVueRN(getDefaultConfig(__dirname))
```

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| `config` | `object` | 你的 Metro 配置（通常来自 `getDefaultConfig(__dirname)`） |

**返回值** `object` — 合并后的 Metro 配置。

插件会自动：
- 配置 `.vue` / `.mjs` 的 SFC 转换器（`babelTransformerPath`）
- 开启 `inlineRequires` 优化
- 模块去重（`nostics` 垫片、`vue` → `@vue/runtime-core`、`vue-router` / `@vue/*` / `rn-dom` 单实例）
- 追加 watchFolders，兼容任意 node_modules 布局

> 自定义配置会与插件合并；自定义 `resolveRequest` 未命中时请返回 `undefined`，
> 让插件的去重逻辑继续处理。

---

## @cat5th/vue-rn/dist/transformer

### Metro Transformer

`.vue` SFC 转换器已由 `withVueRN` 插件自动配置（推荐）。
如需手动指定，使用带扩展名的完整路径：

```js
babelTransformerPath: require.resolve('@cat5th/vue-rn/dist/transformer/index.js')
```

> ⚠️ 手动配置时还需自行处理 `nostics` 垫片与 `@vue/*` 模块去重，
> 推荐直接使用 `@cat5th/vue-rn/metro` 插件。

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
