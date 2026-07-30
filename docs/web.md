# Web 兼容层

> ⚠️ **实验性**：Web 兼容层尚未经过充分测试，API 可能在未来版本中发生变化。

`@cat5th/vue-rn/web` 提供了一个类似 `react-native-web` 的 Web 兼容层，让同一套 Vue 组件可以在浏览器中运行。

## 快速使用

```ts
import { createWebApp } from '@cat5th/vue-rn/web'
import App from './App.vue'

createWebApp(App).mount('#app')
```

`createWebApp` 会自动注入基础 CSS reset，并全局注册所有 RN 兼容组件。

也可以作为 Vue 插件按需注册：

```ts
import { createApp } from 'vue'
import { webPlugin } from '@cat5th/vue-rn/web'
import App from './App.vue'

createApp(App).use(webPlugin).mount('#app')
```

## 组件列表

| 组件 | DOM 映射 | 说明 |
|------|----------|------|
| `View` | `<div>` | 基础容器 |
| `Text` | `<span>` | 文本组件 |
| `Image` | `<img>` | 图片显示 |
| `TextInput` | `<input>` / `<textarea>` | 文本输入（`multiline` 时渲染为 textarea） |
| `ScrollView` | `<div>` | 可滚动容器 |
| `SafeAreaView` | `<div>` | 安全区域 |
| `Switch` | `<div>` | 开关组件 |
| `Pressable` | `<div>` | 可点击容器 |
| `ActivityIndicator` | `<div>` | 加载指示器 |
| `StatusBar` | — | 状态栏占位 |
| `KeyboardAvoidingView` | `<div>` | 键盘避让容器 |
| `ImageBackground` | `<div>` | 背景图容器 |
| `Button` | `<div role="button">` | 按钮 |
| `CheckBox` | `<input type="checkbox">` | 复选框 |
| `ProgressBar` | `<div>` | 进度条 |
| `TouchableOpacity` | `<div>` | 透明度触摸组件 |
| `TouchableHighlight` | `<div>` | 高亮触摸组件 |
| `TouchableWithoutFeedback` | `<div>` | 无反馈触摸组件 |

## API 参考

Web 层实现了常用 RN API 的 Web 兼容版本：

| API | 说明 |
|-----|------|
| `Alert` | 弹窗提示（Web 原生 confirm / 自定义 Dialog） |
| `Platform` | 平台检测（`Platform.OS === 'web'`） |
| `Dimensions` | 窗口尺寸获取与监听 |
| `PixelRatio` | 像素比 |
| `Linking` | URL 跳转 |
| `Clipboard` | 剪贴板读写 |
| `AppState` | 应用状态 |
| `Share` | Web Share API |

## Hooks

| Hook | 说明 |
|------|------|
| `useWindowDimensions()` | 响应式窗口尺寸 |
| `useColorScheme()` | 色彩方案（light/dark） |
| `useLocaleContext()` | 地区上下文 |

## StyleSheet

将 RN style 对象编译为 CSS 类：

```ts
import { StyleSheet } from '@cat5th/vue-rn/web'

const styles = StyleSheet.create({
  root: { flex: 1 },
})
```

- 支持 RN 的简写属性（`paddingHorizontal`、`marginVertical` 等）
- 自动处理单位（数字 → px）
- 不支持 Web 的属性会被安全忽略

## createElement

处理 RN → DOM 的属性映射（事件名、无障碍属性、样式）。
