# Metro Transformer

在 `metro.config.js` 中启用 `.vue` 文件支持：

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

module.exports = mergeConfig(getDefaultConfig(__dirname), {
  transformer: {
    babelTransformerPath: require.resolve('@cat5th/vue-rn/dist/transformer/index'),
  },
  resolver: {
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'vue'],
  },
})
```

如果用了 `vue-router`，需要额外配置模块解析：

```js
const path = require('path')

module.exports = mergeConfig(getDefaultConfig(__dirname), {
  transformer: {
    babelTransformerPath: require.resolve('@cat5th/vue-rn/dist/transformer/index'),
  },
  resolver: {
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'vue'],
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'vue')
        return { filePath: path.join(__dirname, 'node_modules/@vue/runtime-core/dist/runtime-core.cjs.js'), type: 'sourceFile' }
      if (moduleName === 'vue-router')
        return { filePath: path.join(__dirname, 'node_modules/vue-router/dist/vue-router.cjs'), type: 'sourceFile' }
      if (moduleName === 'nostics')
        return { filePath: path.resolve(__dirname, '__stubs__/nostics.cjs'), type: 'sourceFile' }
      return context.resolveRequest(context, moduleName, platform)
    },
  },
  watchFolders: [
    path.resolve(__dirname, 'node_modules/@cat5th/vue-rn'),
    path.resolve(__dirname, 'node_modules/@rasenjs/rn-dom'),
  ],
})
```

创建 `__stubs__/nostics.cjs`：

```js
module.exports = { default: {} }
```

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

## HMR 热更新

开发时修改 `.vue` 文件自动热替换，组件状态保持不丢失。修改 CSS 配置文件后需重启 Metro。
