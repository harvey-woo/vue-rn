/**
 * Type declarations for .vue SFC files.
 * Allows TypeScript to import *.vue modules without errors.
 *
 * RN 内置组件类型（View / Text 等）由 @cat5th/vue-rn 主入口自动注册，
 * 无需在此引用 tags.d.ts。
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

/** RN 运行时在 index.ts 中 polyfill 的浏览器全局。 */
declare const window: any
declare const performance: { now(): number }
