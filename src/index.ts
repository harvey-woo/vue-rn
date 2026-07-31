/**
 * Vue 3 Custom Renderer for React Native Fabric
 *
 * Replaces @vue/runtime-dom's DOM backend with @rasenjs/rn-dom.
 * Vue template → VNode → rn-dom → Fabric.
 *
 * Usage:
 *   import { createApp } from '@rasenjs/vue-rn'
 *   import App from './App.vue'
 *   import { RNDocument } from '@rasenjs/rn-dom'
 *
 *   AppRegistry.registerRunnable('MyApp', ({ rootTag }) => {
 *     const doc = RNDocument.getOrCreate(rootTag)
 *     createApp(App).mount(doc.body)
 *   })
 */

import { AppRegistry } from 'react-native'
import { createRenderer, getCurrentInstance } from '@vue/runtime-core'
import { RNDocument, normalizeEventName, isEvent } from '@rasenjs/rn-dom'
import type { RNNode, RNTextNode, RNCommentNode } from '@rasenjs/rn-dom'

// 引入全局组件类型声明（GlobalComponents），
// 用户 import 本包即可在 .vue 模板获得 RN 组件补全与类型检查。
import './global-types'

let _doc: RNDocument | null = null

// ---------------------------------------------------------------------------
// patchStyle
// ---------------------------------------------------------------------------

function patchStyle(
  el: RNNode,
  _prev: string | Record<string, unknown> | null,
  next: string | Record<string, unknown> | null,
): void {
  if (next == null) {
    el.removeAttribute('style')
    return
  }
  // Replace entire style in one shot — avoids N individual setProperty calls
  // (each of which does spread + markDirty).
  el.setAttribute('style', { ...(typeof next === 'object' ? next : {}) })
}

// ---------------------------------------------------------------------------
// DOM operations for Vue renderer
// ---------------------------------------------------------------------------

type VNode = RNNode | RNTextNode | RNCommentNode

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createVueRenderer(): any {
  return createRenderer({
    insert(child: VNode, parent: RNNode, anchor: VNode | null): void {
      parent.insertBefore(child, anchor as RNNode | null)
    },

    remove(child: VNode): void {
      child.parentNode?.removeChild(child)
    },

    createElement(tag: string): RNNode {
      return _doc!.createElement(tag)
    },

    createText(text: string): RNTextNode {
      return _doc!.createTextNode(text)
    },

    createComment(text: string): RNCommentNode {
      return _doc!.createComment(text)
    },

    setText(node: VNode, text: string): void {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(node as any).textContent = text
    },

    setElementText(el: RNNode, text: string): void {
      el.textContent = text
    },

    parentNode(node: VNode): RNNode | null {
      return node.parentNode
    },

    nextSibling(node: VNode): VNode | null {
      return (node.nextSibling as VNode | null) ?? null
    },

    patchProp(el: RNNode, key: string, prevValue: unknown, nextValue: unknown): void {
      if (key === 'class') return

      if (key === 'style') {
        patchStyle(
          el,
          prevValue as string | Record<string, unknown> | null,
          nextValue as string | Record<string, unknown> | null,
        )
        return
      }

      if (isEvent(key)) {
        const rnKey = normalizeEventName(key)
        if (prevValue != null) el.removeAttribute(rnKey)
        if (nextValue != null) el.setAttribute(rnKey, nextValue)
        return
      }

      if (nextValue == null) {
        el.removeAttribute(key)
      } else {
        el.setAttribute(key, nextValue)
      }
    },

    setScopeId(): void {},
    insertStaticContent(): any { return [] },
  })
}

// ---------------------------------------------------------------------------
// createApp
// ---------------------------------------------------------------------------

export interface VueRNMountable {
  mount(container: any): void
  unmount(): void
  use(plugin: any, ...options: any[]): VueRNMountable
  register(appName: string, setup?: () => void): void
}

export function createApp(rootComponent: object): VueRNMountable {
  const renderer = createVueRenderer()
  const app = renderer.createApp(rootComponent)

  return {
    mount(container: any) {
      // container is typically doc.body — extract the document for createElement
      _doc = container.ownerDocument ?? container
      app.mount(container)
    },

    unmount() {
      app.unmount()
    },

    use(plugin: any, ...options: any[]) {
      app.use(plugin, ...options)
      return this
    },

    register(appName: string, setup?: () => void) {
      AppRegistry.registerRunnable(appName, ({ rootTag }: any) => {
        const doc = getOrCreateDocument(rootTag as number)
        setup?.()
        _doc = doc
        app.mount(doc.body)
      })
    },
  }
}

// Re-export RNDocument so consumers don't need a direct dep on @rasenjs/rn-dom
// just to create a document instance.
export { RNDocument }

/**
 * Convenience alias for `RNDocument.getOrCreate()`.
 *
 * Usage:
 *   import { createVueRNApp, getOrCreateDocument } from '@rasenjs/vue-rn'
 *
 *   AppRegistry.registerRunnable('MyApp', ({ rootTag }) => {
 *     const doc = getOrCreateDocument(rootTag)
 *     createVueRNApp(App).mount(doc.body)
 *   })
 */
export function getOrCreateDocument(rootTag?: number): RNDocument {
  return RNDocument.getOrCreate(rootTag)
}

// ---------------------------------------------------------------------------
// useCssModule — re-exported for convenience
// ---------------------------------------------------------------------------

/**
 * Returns the CSS module class name mapping for the current component.
 *
 * Use in `<script setup>`:
 *   import { useCssModule } from '@rasenjs/vue-rn'
 *   const style = useCssModule()       // <style module>
 *   const foo = useCssModule('foo')    // <style module="foo">
 *
 * Or in templates via `$style`:
 *   <View :style="$style.myClass" />
 *   <View :style="$style.foo.myClass" />
 */

/** CSS module 中一个 class 对应的 RN style 对象 */
export type CSSModuleStyle = Record<string, string | number | boolean>

/** CSS module 映射：className → RN style 对象 */
export type CSSModules = Record<string, CSSModuleStyle>

/**
 * 获取当前组件的 CSS Module style 映射（推荐）。
 *
 * 与 Vue 内置 `useCssModule`（返回 CSS 类名字符串）不同，
 * vue-rn 的 CSS Module 直接编译为 RN style 对象，因此使用本函数。
 * 采用独立命名可避免与 Vue 内置 API 的语义冲突
 * （vue-tsc 会对名为 `useCssModule` 的调用做硬编码类型推断）。
 *
 * ```ts
 * const style = useStyleModule()          // <style module>
 * const foo = useStyleModule('foo')       // <style module="foo">
 * ```
 *
 * 模板中仍可使用 `$style`：
 *   <View :style="$style.myClass" />
 */
export function useStyleModule(name = '$style'): CSSModules {
  const instance = getCurrentInstance()
  if (!instance) {
    return {}
  }
  const modules = (instance.type as Record<string, unknown>).__cssModules as Record<string, unknown> | undefined
  if (!modules) {
    return {}
  }
  const mod = modules[name] as CSSModules | undefined
  return mod ?? {}
}

/**
 * @deprecated 请使用 `useStyleModule`。
 *
 * 由于 vue-tsc 对名为 `useCssModule` 的调用有硬编码类型推断
 * （会按 Vue 内置语义推断为 `Record<string, string>`），
 * 在 `.vue` 的 `<script setup>` 中使用本函数可能获得错误的返回类型。
 * 模板中的 `$style` 不受影响。
 */
export function useCssModule(name = '$style'): CSSModules {
  return useStyleModule(name)
}
