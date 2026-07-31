/**
 * @cat5th/vue-rn — 全局组件类型声明（自动注册）
 *
 * 通过 `declare module 'vue'` 的 `GlobalComponents` 注册 RN 内置组件类型。
 * 主入口 import 本文件后，用户只需 `import { createApp } from '@cat5th/vue-rn'`
 * 即可获得 .vue 模板中的组件补全与类型检查，无需手动 `/// <reference>`。
 *
 * Props 类型来自 `@rasenjs/rn-dom` 的 `RNElementPropMap`（映射 RN 原生组件）。
 * 事件类型由 vue-rn 的事件系统支持（rn-dom normalizeEventName + Fabric 分派）。
 */

import type { DefineComponent } from 'vue'
import type { RNElementPropMap, RNEvent } from '@rasenjs/rn-dom'

// ── 通用事件类型 ────────────────────────────────────────────────────
// vue-rn 的 `@touchEnd` 等事件经 rn-dom normalizeEventName 映射为
// Fabric 的 onTouchEnd / onTouchStart 等。回调参数为 rn-dom 的 RNEvent。

/** 触摸事件（View 等通用组件） */
export interface RNTouchEvents {
  onTouchEnd?: (event: RNEvent) => void
  onTouchStart?: (event: RNEvent) => void
  onTouchMove?: (event: RNEvent) => void
  onTouchCancel?: (event: RNEvent) => void
  /** onPress 是 onTouchEnd 的回退（rn-dom 支持） */
  onPress?: (event: RNEvent) => void
}

/** TextInput 事件 */
export interface RNTextInputEvents {
  onChange?: (event: RNEvent) => void
  onFocus?: (event: RNEvent) => void
  onBlur?: (event: RNEvent) => void
  onSubmitEditing?: (event: RNEvent) => void
}

/** Image 事件 */
export interface RNImageEvents {
  onLoad?: (event: RNEvent) => void
  onError?: (event: RNEvent) => void
}

/** ScrollView 事件 */
export interface RNScrollViewEvents {
  onScroll?: (event: RNEvent) => void
}

// ── 组件类型构造 ────────────────────────────────────────────────────

type RNComponent<
  T extends keyof RNElementPropMap,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Extra = {},
> = DefineComponent<RNElementPropMap[T] & Extra, {}, any>

// ── 自动注册到 Vue 全局组件 ─────────────────────────────────────────

declare module 'vue' {
  export interface GlobalComponents {
    View: RNComponent<'View', RNTouchEvents>
    SafeAreaView: RNComponent<'SafeAreaView', RNTouchEvents>
    Text: RNComponent<'Text', RNTouchEvents>
    Image: RNComponent<'Image', RNImageEvents & RNTouchEvents>
    TextInput: RNComponent<'TextInput', RNTextInputEvents>
    AndroidTextInput: RNComponent<'AndroidTextInput', RNTextInputEvents>
    ScrollView: RNComponent<'ScrollView', RNScrollViewEvents & RNTouchEvents>
    AndroidHorizontalScrollView: RNComponent<'AndroidHorizontalScrollView', RNScrollViewEvents & RNTouchEvents>
    ActivityIndicator: RNComponent<'ActivityIndicator'>
    ProgressBarAndroid: RNComponent<'ProgressBarAndroid'>
    Switch: RNComponent<'Switch', RNTouchEvents>
    AndroidSwitch: RNComponent<'AndroidSwitch', RNTouchEvents>
    RefreshControl: RNComponent<'RefreshControl'>
    AndroidSwipeRefreshLayout: RNComponent<'AndroidSwipeRefreshLayout'>
    Modal: RNComponent<'Modal', RNTouchEvents>
    DrawerLayoutAndroid: RNComponent<'DrawerLayoutAndroid'>
    Pressable: RNComponent<'Pressable', RNTouchEvents>
    TouchableOpacity: RNComponent<'TouchableOpacity', RNTouchEvents>
    TouchableHighlight: RNComponent<'TouchableHighlight', RNTouchEvents>
    TouchableWithoutFeedback: RNComponent<'TouchableWithoutFeedback', RNTouchEvents>
    KeyboardAvoidingView: RNComponent<'KeyboardAvoidingView'>
    StatusBar: RNComponent<'StatusBar'>
    DebuggingOverlay: RNComponent<'DebuggingOverlay'>
  }
}

export {}
