/// <reference path="node_modules/@rasenjs/vue-rn/tags.d.ts" />

/**
 * Type declarations for .vue SFC files.
 * Allows TypeScript to import *.vue modules without errors.
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

/** RN 运行时在 index.ts 中 polyfill 的浏览器全局。 */
declare const window: any
declare const performance: { now(): number }
