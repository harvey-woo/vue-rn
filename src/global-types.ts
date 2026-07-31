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

/** 触摸事件（View 等通用组件）— 对齐 RN View API */
export interface RNTouchEvents {
  onTouchEnd?: (event: RNEvent) => void
  onTouchStart?: (event: RNEvent) => void
  onTouchMove?: (event: RNEvent) => void
  onTouchCancel?: (event: RNEvent) => void
  onFocus?: (event: RNEvent) => void
  onBlur?: (event: RNEvent) => void
  onLayout?: (event: RNEvent) => void
}

/** Press 事件（Pressable / Touchable* / 可点击组件）— 对齐 RN Pressable API */
export interface RNPressEvents {
  /** 点击（Fabric 原生 topPress 或 touch 合成） */
  onPress?: (event: RNEvent) => void
  /** 按下开始（由 onTouchStart 合成） */
  onPressIn?: (event: RNEvent) => void
  /** 按下移动（由 onTouchMove 合成） */
  onPressMove?: (event: RNEvent) => void
  /** 按下结束（由 onTouchEnd 合成） */
  onPressOut?: (event: RNEvent) => void
  /** 长按（按住 500ms 触发） */
  onLongPress?: (event: RNEvent) => void
}

/** TextInput 事件 — 对齐 RN TextInput API */
export interface RNTextInputEvents {
  /** 文本变化，回调直接收到字符串（RN 表面 API） */
  onChangeText?: (text: string) => void
  /** 底层变化事件（兼容） */
  onChange?: (event: RNEvent) => void
  onFocus?: (event: RNEvent) => void
  onBlur?: (event: RNEvent) => void
  onSubmitEditing?: (event: RNEvent) => void
  onEndEditing?: (event: RNEvent) => void
  onKeyPress?: (event: RNEvent) => void
  onSelectionChange?: (event: RNEvent) => void
  onContentSizeChange?: (event: RNEvent) => void
}

/** Image 事件 */
export interface RNImageEvents {
  onLoad?: (event: RNEvent) => void
  onError?: (event: RNEvent) => void
}

/** ScrollView 事件 — 对齐 RN ScrollView API */
export interface RNScrollViewEvents {
  onScroll?: (event: RNEvent) => void
  onScrollBeginDrag?: (event: RNEvent) => void
  onScrollEndDrag?: (event: RNEvent) => void
  onMomentumScrollBegin?: (event: RNEvent) => void
  onMomentumScrollEnd?: (event: RNEvent) => void
  onContentSizeChange?: (event: RNEvent) => void
  onScrollToTop?: (event: RNEvent) => void
}

/** Modal 事件 — 对齐 RN Modal API */
export interface RNModalEvents {
  onShow?: (event: RNEvent) => void
  onDismiss?: () => void
  onRequestClose?: (event: RNEvent) => void
  onOrientationChange?: (event: RNEvent) => void
}

/** Switch 事件 — 对齐 RN Switch API */
export interface RNSwitchEvents {
  /** 值变化，回调收到布尔（RN 表面 API） */
  onValueChange?: (value: boolean) => void
  onChange?: (event: RNEvent) => void
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
    View: RNComponent<'View', RNTouchEvents & RNPressEvents>
    SafeAreaView: RNComponent<'SafeAreaView', RNTouchEvents>
    Text: RNComponent<'Text', RNTouchEvents & RNPressEvents>
    Image: RNComponent<'Image', RNImageEvents & RNTouchEvents>
    TextInput: RNComponent<'TextInput', RNTextInputEvents>
    AndroidTextInput: RNComponent<'AndroidTextInput', RNTextInputEvents>
    ScrollView: RNComponent<'ScrollView', RNScrollViewEvents & RNTouchEvents>
    AndroidHorizontalScrollView: RNComponent<'AndroidHorizontalScrollView', RNScrollViewEvents & RNTouchEvents>
    ActivityIndicator: RNComponent<'ActivityIndicator'>
    ProgressBarAndroid: RNComponent<'ProgressBarAndroid'>
    Switch: RNComponent<'Switch', RNSwitchEvents>
    AndroidSwitch: RNComponent<'AndroidSwitch', RNSwitchEvents>
    RefreshControl: RNComponent<'RefreshControl'>
    AndroidSwipeRefreshLayout: RNComponent<'AndroidSwipeRefreshLayout'>
    Modal: RNComponent<'Modal', RNModalEvents>
    DrawerLayoutAndroid: RNComponent<'DrawerLayoutAndroid'>
    Pressable: RNComponent<'Pressable', RNPressEvents>
    TouchableOpacity: RNComponent<'TouchableOpacity', RNPressEvents>
    TouchableHighlight: RNComponent<'TouchableHighlight', RNPressEvents>
    TouchableWithoutFeedback: RNComponent<'TouchableWithoutFeedback', RNPressEvents>
    KeyboardAvoidingView: RNComponent<'KeyboardAvoidingView'>
    StatusBar: RNComponent<'StatusBar'>
    DebuggingOverlay: RNComponent<'DebuggingOverlay'>
  }
}

export {}
