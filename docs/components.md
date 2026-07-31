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
事件经 rn-dom 归一化为 Fabric 原生事件，回调参数为 `RNEvent`（含 `nativeEvent`）。

### 通用触摸事件（View / Text / 所有可点击组件）

| 事件 | 说明 | 回调参数 |
|------|------|---------|
| `@touchEnd` | 触摸结束（点击） | `RNEvent` |
| `@touchStart` | 触摸开始 | `RNEvent` |
| `@touchMove` | 触摸移动 | `RNEvent` |
| `@touchCancel` | 触摸取消 | `RNEvent` |
| `@press` | `touchEnd` 的别名（等价于 `onPress`） | `RNEvent` |
| `@click` | `touchEnd` 的别名 | `RNEvent` |

```vue
<View @touchEnd="handleTap">
  <Text>点击我</Text>
</View>
```

### TextInput 事件

| 事件 | 说明 |
|------|------|
| `@change` | 文本变化（`onChange`） |
| `@input` | `change` 的别名 |
| `@focus` | 获得焦点 |
| `@blur` | 失去焦点 |
| `@submitEditing` | 提交编辑 |

```vue
<TextInput :text="draft" @change="draft = $event.text" />
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
- **事件类型**：`RNTouchEvents`、`RNTextInputEvents` 等，回调参数为 `RNEvent`
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
