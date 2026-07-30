const path = require('path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

const vueRNRoot = path.resolve(__dirname, '../..')
const vueRNPath = path.join(vueRNRoot, 'dist')
const exampleRoot = __dirname
const reactNativePath = path.join(exampleRoot, 'node_modules/react-native')
const rnDomPath = path.join(exampleRoot, 'node_modules/@rasenjs/rn-dom/dist')
const vueRuntimeCorePath = path.join(exampleRoot, 'node_modules/@vue/runtime-core')

const defaultConfig = getDefaultConfig(__dirname)

const config = {
  transformer: {
    babelTransformerPath: path.join(vueRNPath, 'transformer/index'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'vue', 'mjs'],
    resolveRequest: (context, moduleName, platform) => {
      // ── 消费者必需 ──────────────────────────────────────────
      //
      // vue-router 的 CJS bundle 里 require('nostics')，但 nostics
      // 是 ESM-only（无 CJS 入口），Metro 解析会失败。
      // 需要提供一个 CJS 垫片。消费者也需要此配置。
      if (moduleName === 'nostics') {
        return {
          filePath: path.resolve(__dirname, '__stubs__/nostics.cjs'),
          type: 'sourceFile',
        }
      }

      // vue-router CJS 中 require('vue')，vue 包依赖 @vue/runtime-dom。
      // runtime-dom 引用了 document.createElement 等 Web API，
      // 在 Hermes 中不存在，会直接崩溃。
      // 把 'vue' 重定向到 @vue/runtime-core 即可跳过 runtime-dom。
      // 消费者也需要此配置。
      if (moduleName === 'vue') {
        return {
          filePath: path.join(vueRuntimeCorePath, 'dist/runtime-core.cjs.js'),
          type: 'sourceFile',
        }
      }

      // ── 开发环境专用（npm workspaces / file:.. symlink 问题） ──
      //
      // 以下重定向都因为本项目通过 "file:.." symlink 引用 vue-rn：
      //   examples/vue-rn-test/node_modules/@rasenjs/vue-rn → ../../../..
      //
      // symlink 内部的代码（dist/index.js）中 require('@vue/runtime-core')
      // 会被 Metro 解析为 ../../node_modules/@vue/runtime-core/...，
      // 而同一文件被直接引用时路径为 node_modules/@vue/runtime-core/...。
      // Metro 按字符串路径标识模块——两套路径被视为两个不同模块，
      // 导致 Vue 模块级状态（reactivity 系统、Symbol 注入 key 等）分裂，
      // 事件处理器在一份中注册、Fabric 在另一份中查找，点击事件失效。
      //
      // 消费者通过 npm registry 正常安装 @cat5th/vue-rn 时不存在 symlink，
      // 所有 @vue/* 路径一致，以下拦截都不需要。

      // 防止 vue-router 产生重复实例。vue-router 用 Symbol('router') 作为
      // provide/inject 的 key，两副本各自有不同 Symbol 实例会导致
      // app.provide(routerKey, router) 与组件中 inject(routerKey) 匹配不上。
      if (moduleName === 'vue-router') {
        return {
          filePath: path.join(exampleRoot, 'node_modules/vue-router/dist/vue-router.cjs'),
          type: 'sourceFile',
        }
      }

      // watchFolders 跨目录，手动确保 react-native 从例子自己的 node_modules 解析
      if (moduleName === 'react-native' || moduleName.startsWith('react-native/')) {
        const subPath = moduleName === 'react-native' ? 'index.js' : moduleName.slice('react-native/'.length) + '.js'
        return {
          filePath: path.join(reactNativePath, subPath),
          type: 'sourceFile',
        }
      }

      // symlink 内 require('@rasenjs/vue-rn') 可能解析到错误位置
      if (moduleName === '@rasenjs/vue-rn') {
        return {
          filePath: path.join(vueRNPath, 'index.js'),
          type: 'sourceFile',
        }
      }
      if (moduleName === '@rasenjs/vue-rn/router') {
        return {
          filePath: path.join(vueRNPath, 'router.js'),
          type: 'sourceFile',
        }
      }

      // symlink 内 require('@rasenjs/rn-dom') 可能解析到错误位置
      if (moduleName === '@rasenjs/rn-dom') {
        return {
          filePath: path.join(rnDomPath, 'index.js'),
          type: 'sourceFile',
        }
      }
      if (moduleName === '@rasenjs/rn-dom/elements') {
        return {
          filePath: path.join(rnDomPath, '..', 'elements.cjs'),
          type: 'sourceFile',
        }
      }

      // 强制 @vue/* 同版本只有一个物理文件被打包，防止 Vue 全局状态分裂。
      // 两副本各自有独立的模块级状态（如 reactive 系统、effect 栈、
      // Symbol 注入 key），事件处理器在一份中注册、Fabric 在另一份中查找，
      // 导致点击事件不生效。
      if (moduleName === '@vue/runtime-core') {
        return {
          filePath: path.join(vueRuntimeCorePath, 'dist/runtime-core.cjs.js'),
          type: 'sourceFile',
        }
      }
      if (moduleName === '@vue/reactivity') {
        return {
          filePath: path.join(exampleRoot, 'node_modules/@vue/reactivity/dist/reactivity.cjs.js'),
          type: 'sourceFile',
        }
      }
      if (moduleName === '@vue/shared') {
        return {
          filePath: path.join(exampleRoot, 'node_modules/@vue/shared/dist/shared.cjs.js'),
          type: 'sourceFile',
        }
      }
      return context.resolveRequest(context, moduleName, platform)
    },
  },
  watchFolders: [
    vueRNRoot,
    vueRNPath,
    rnDomPath,
    vueRuntimeCorePath,
    path.join(exampleRoot, 'node_modules/@vue/reactivity'),
    path.join(exampleRoot, 'node_modules/@vue/shared'),
  ],
}

module.exports = mergeConfig(defaultConfig, config)
