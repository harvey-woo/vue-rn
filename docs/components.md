# 组件

`@cat5th/vue-rn` 内置了 React Native 的常用组件，可在 `.vue` 模板中直接使用。
所有组件均为 **RN 原生组件**（经 `@rasenjs/rn-dom` 渲染为 Fabric 节点），
Props 与事件语义与 React Native 保持一致。

> 组件类型已自动注册：`import { createApp } from '@cat5th/vue-rn'` 后，
> Volar / TypeScript 即可在 `.vue` 模板中获得组件补全与类型检查。

## 组件列表

| 组件 | 对应 RN 组件 | Props 参考 |
|------|-------------|-----------|
| `View` | [`View`](https://reactnative.dev/docs/view) | `RNElementPropMap['View']` |
| `Text` | [`Text`](https://reactnative.dev/docs/text) | `RNElementPropMap['Text']` |
| `Image` | [`Image`](https://reactnative.dev/docs/image) | `RNElementPropMap['Image']` |
| `TextInput` | [`TextInput`](https://reactnative.dev/docs/textinput) | `RNElementPropMap['TextInput']` |
| `ScrollView` | [`ScrollView`](https://reactnative.dev/docs/scrollview) | `RNElementPropMap['ScrollView']` |
| `SafeAreaView` | [`SafeAreaView`](https://reactnative.dev/docs/safeareaview) | `RNElementPropMap['SafeAreaView']` |
| `Switch` | [`Switch`](https://reactnative.dev/docs/switch) | `RNElementPropMap['Switch']` |
| `Pressable` | [`Pressable`](https://reactnative.dev/docs/pressable) | `RNElementPropMap['Pressable']` |
| `ActivityIndicator` | [`ActivityIndicator`](https://reactnative.dev/docs/activityindicator) | `RNElementPropMap['ActivityIndicator']` |
| `StatusBar` | [`StatusBar`](https://reactnative.dev/docs/statusbar) | `RNElementPropMap['StatusBar']` |
| `KeyboardAvoidingView` | [`KeyboardAvoidingView`](https://reactnative.dev/docs/keyboardavoidingview) | `RNElementPropMap['KeyboardAvoidingView']` |
| `Modal` | [`Modal`](https://reactnative.dev/docs/modal) | `RNElementPropMap['Modal']` |
| `RefreshControl` | [`RefreshControl`](https://reactnative.dev/docs/refreshcontrol) | `RNElementPropMap['RefreshControl']` |
| `DrawerLayoutAndroid` | [`DrawerLayoutAndroid`](https://reactnative.dev/docs/drawerlayoutandroid) | `RNElementPropMap['DrawerLayoutAndroid']` |
| `TouchableOpacity` | [`TouchableOpacity`](https://reactnative.dev/docs/touchableopacity) | `RNElementPropMap['TouchableOpacity']` |
| `TouchableHighlight` | [`TouchableHighlight`](https://reactnative.dev/docs/touchablehighlight) | `RNElementPropMap['TouchableHighlight']` |
| `TouchableWithoutFeedback` | [`TouchableWithoutFeedback`](https://reactnative.dev/docs/touchablewithoutfeedback) | `RNElementPropMap['TouchableWithoutFeedback']` |

> RN 组件的完整 Props 与行为请参考 [React Native 文档](https://reactnative.dev/docs/components-and-apis)。
> 除下列事件外，其余 Props 与 RN 一致。

## 事件

vue-rn 使用 **DOM 风格事件名**，在模板中通过 `@` 绑定。
事件经 rn-dom 归一化为 Fabric 原生事件，**命名与 React Native 官方 API 一致**。
回调参数为 `RNEvent`（含 `nativeEvent`），`onChangeText` 回调直接收到字符串。

### 触摸事件（View / Text）— 对齐 RN View API

| 事件 | 说明 | 回调参数 |
|------|------|---------|
| `@touchEnd` | 触摸结束 | `RNEvent` |
| `@touchStart` | 触摸开始 | `RNEvent` |
| `@touchMove` | 触摸移动 | `RNEvent` |
| `@touchCancel` | 触摸取消 | `RNEvent` |

```vue
<View @touchEnd="handleTap">
  <Text>点击我</Text>
</View>
```

### Press 事件（Pressable / Touchable* / View / Text）— 对齐 RN Pressable API

| 事件 | 说明 | 回调参数 |
|------|------|---------|
| `@press` | 点击（`onPress`） | `RNEvent` |
| `@pressIn` | 按下开始（由触摸合成） | `RNEvent` |
| `@pressMove` | 按下移动（由触摸合成） | `RNEvent` |
| `@pressOut` | 按下结束（由触摸合成） | `RNEvent` |
| `@longPress` | 长按（按住 500ms） | `RNEvent` |

> `onPress` 由 Fabric 原生 `topPress` 事件触发；`onPressIn`/`onPressMove`/
> `onPressOut`/`onLongPress` 由 rn-dom 从触摸事件合成（与 RN Pressability
> 行为一致）。序列：`pressIn → (pressMove*) → [longPress 500ms] → pressOut → press`，
> 长按会抑制 `onPress`。独立事件（如 `onPress` 与 `onTouchEnd`）都会触发，
> 冒泡在第一个处理该事件的节点停止。

```vue
<Pressable @press="handlePress" @longPress="handleLongPress">
  <Text>按我</Text>
</Pressable>
```

### TextInput 事件 — 对齐 RN TextInput API

| 事件 | 说明 |
|------|------|
| `@changeText` | 文本变化，**回调直接收到字符串**（推荐） |
| `@change` | 底层变化事件（回调收到 `RNEvent`） |
| `@focus` | 获得焦点 |
| `@blur` | 失去焦点 |
| `@submitEditing` | 提交编辑 |
| `@endEditing` | 结束编辑 |
| `@keyPress` | 按键 |

```vue
<TextInput :text="draft" @changeText="draft = $event" />
```

### Image 事件

| 事件 | 说明 |
|------|------|
| `@load` | 图片加载完成 |
| `@error` | 图片加载失败 |

### ScrollView 事件

| 事件 | 说明 |
|------|------|
| `@scroll` | 滚动 |

## 类型说明

- **Props 类型**：来自 `@rasenjs/rn-dom` 的 `RNElementPropMap`，
  映射 React Native 原生组件类型（`ViewProps`、`TextProps` 等）
- **事件类型**：`RNTouchEvents`、`RNPressEvents`、`RNTextInputEvents` 等，
  与 RN 官方组件 API 对齐
- **自动注册**：无需手动引用类型文件，import 主包即生效

```ts
// index.ts — 自动注册组件类型
import { createApp } from '@cat5th/vue-rn'
```

---

## 下一步

- [入门指南](./getting-started.md) — 完整项目初始化
- [路由集成](./router.md) — 导航与 RouterLink
- [API 参考](./api.md) — 完整 API 签名
