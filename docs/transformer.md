# Metro Transformer

`@cat5th/vue-rn/metro` 的 `withVueRN` 插件自动启用 `.vue` 文件支持，
无需手动配置 transformer 或模块解析：

```js
const { getDefaultConfig } = require('@react-native/metro-config')
const { withVueRN } = require('@cat5th/vue-rn/metro')

module.exports = withVueRN(getDefaultConfig(__dirname))
```

## 插件做了什么

| 配置项 | 说明 |
|--------|------|
| `transformer.babelTransformerPath` | 指向内置的 `.vue` SFC 转换器 |
| `transformer.getTransformOptions` | 开启 `inlineRequires` 优化 |
| `resolver.sourceExts` | 追加 `vue`、`mjs` 扩展名 |
| `resolver.resolveRequest` | 模块去重：`nostics` 垫片、`vue` → `@vue/runtime-core`、`vue-router` / `@vue/*` / `rn-dom` 单实例 |
| `watchFolders` | 追加包根目录，保证任意 node_modules 布局下可解析 |

> ⚠️ 不要手动配置 `babelTransformerPath` 或 `resolveRequest`——
> 插件已封装全部必需配置，手动覆盖可能破坏模块去重，
> 导致 Vue 全局状态分裂、点击事件不生效。

### 保留自定义配置

插件会与你的自定义配置合并：

```js
module.exports = withVueRN({
  ...getDefaultConfig(__dirname),
  resolver: {
    ...getDefaultConfig(__dirname).resolver,
    // 自定义扩展名仍然生效
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'myext'],
  },
})
```

> 如需自定义 `resolveRequest`，注意未命中时返回 `undefined`，
> 让插件的去重逻辑继续处理。

## CSS 工具类

模板中的 class 名在构建时自动编译为 RN style 对象：

```vue
<View class="flex-1 bg-blue-500">
  <Text class="text-white font-bold">Hello</Text>
</View>
```

支持与 `:style` 混用：

```vue
<View class="flex-1" :style="{ borderRadius: 8 }">
```

支持 **Tailwind CSS v3/v4** 和 **UnoCSS**，自动检测项目依赖。

> 需要在项目中安装对应的 CSS 工具库（如 `tailwindcss`），
> 转换器会在构建时自动扫描并解析 class。

## HMR 热更新

开发时修改 `.vue` 文件自动热替换，组件状态保持不丢失。修改 CSS 配置文件后需重启 Metro。

---

## 下一步

- [入门指南](./getting-started.md) — 项目初始化与 Metro 配置
- [Native 渲染](./native.md) — CSS Modules 与样式处理
- [API 参考](./api.md) — `withVueRN` 完整签名
