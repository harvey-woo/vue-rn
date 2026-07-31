/**
 * @cat5th/vue-rn — Metro 配置插件
 *
 * 封装消费者所需的全部 Metro 配置（transformer、sourceExts、resolveRequest
 * 拦截），让用户在 metro.config.js 中只写一行：
 *
 *   const { getDefaultConfig } = require('@react-native/metro-config')
 *   const { withVueRN } = require('@cat5th/vue-rn/metro')
 *
 *   module.exports = withVueRN(getDefaultConfig(__dirname))
 *
 * 为什么需要这些拦截（详见各分支注释）：
 *  - nostics:           vue-router 的 CJS bundle require('nostics')，
 *                       nostics 是 ESM-only，需要 CJS 垫片。
 *  - vue:               vue 依赖 @vue/runtime-dom，它引用 document.createElement
 *                       等 Web API，Hermes 中不存在会崩溃，重定向到
 *                       @vue/runtime-core 跳过。
 *  - vue-router:        exports 多入口，Metro 按 require/import 条件解析出多份
 *                       实例，Symbol('router') 不共享，useRouter() 失效。
 *  - @vue/*:            vue-router 5.x devtools chunk 引入 ESM 入口副本，
 *                       与 CJS 入口形成多份模块，Vue 模块级状态分裂。
 *  - @rasenjs/rn-dom:   exports 里 require→index.cjs / import→index.js，
 *                       双入口导致 rn-dom 双实例。
 *  - @cat5th/vue-rn:    同理，强制单一入口。
 */

import path from 'path'

interface ResolveContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolveRequest: (context: any, moduleName: string, platform: string | undefined) => any
  [key: string]: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MetroConfig = Record<string, any>

/** 解析某包在用户 node_modules 中的根目录 */
function packageRoot(pkgName: string): string {
  return path.dirname(require.resolve(`${pkgName}/package.json`))
}

/** @vue/* 的 CJS 构建入口（*.cjs.js） */
function vueEntry(pkgName: string, file: string): string {
  return path.join(packageRoot(pkgName), 'dist', file)
}

/**
 * 将 @cat5th/vue-rn 所需的 Metro 配置合并进用户的 config。
 *
 * @param config 用户的 Metro 配置（通常来自 getDefaultConfig(__dirname)）
 * @returns 合并后的配置
 */
export function withVueRN(config: MetroConfig): MetroConfig {
  // @cat5th/vue-rn 自身位置（从插件文件反推，兼容任意 node_modules 布局）
  const vueRNRoot = path.dirname(require.resolve('@cat5th/vue-rn/package.json'))
  // rn-dom 的 exports 未导出 ./package.json，用主入口反推包根
  const rnDomRoot = path.resolve(
    require.resolve('@rasenjs/rn-dom'),
    '../..',
  )

  // 保留用户自己的 resolveRequest（若有），先执行再 fallback
  const userResolveRequest = config?.resolver?.resolveRequest

  // 合并用户已有 sourceExts（如 .js .jsx .ts .tsx .json）
  const baseExts: string[] = config?.resolver?.sourceExts ?? []
  const sourceExts = [...new Set([...baseExts, 'vue', 'mjs'])]

  // 保留用户已有 watchFolders
  const baseWatchFolders: string[] = config?.watchFolders ?? []

  return {
    ...config,
    transformer: {
      ...(config?.transformer ?? {}),
      babelTransformerPath: path.join(vueRNRoot, 'dist/transformer/index.js'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      ...(config?.resolver ?? {}),
      sourceExts,
      resolveRequest: (
        context: ResolveContext,
        moduleName: string,
        platform: string | undefined,
      ) => {
        // 用户自定义的拦截优先
        if (userResolveRequest) {
          const result = userResolveRequest(context, moduleName, platform)
          if (result) return result
        }

        // nostics：vue-router 的 ESM-only 依赖，提供 CJS 垫片
        if (moduleName === 'nostics') {
          return {
            filePath: path.join(vueRNRoot, 'dist/metro/nostics.cjs'),
            type: 'sourceFile',
          }
        }

        // vue → @vue/runtime-core：跳过 @vue/runtime-dom（Hermes 无 DOM API）
        if (moduleName === 'vue') {
          return {
            filePath: vueEntry('@vue/runtime-core', 'runtime-core.cjs.js'),
            type: 'sourceFile',
          }
        }

        // vue-router：强制单实例（Symbol('router') 共享）
        if (moduleName === 'vue-router') {
          return {
            filePath: vueEntry('vue-router', 'vue-router.cjs'),
            type: 'sourceFile',
          }
        }

        // @vue/*：强制单实例，防止 devtools chunk 引入多份
        if (moduleName === '@vue/runtime-core') {
          return { filePath: vueEntry('@vue/runtime-core', 'runtime-core.cjs.js'), type: 'sourceFile' }
        }
        if (moduleName === '@vue/reactivity') {
          return { filePath: vueEntry('@vue/reactivity', 'reactivity.cjs.js'), type: 'sourceFile' }
        }
        if (moduleName === '@vue/shared') {
          return { filePath: vueEntry('@vue/shared', 'shared.cjs.js'), type: 'sourceFile' }
        }

        // rn-dom / vue-rn：强制单一入口，防止 require/import 条件分裂
        if (moduleName === '@rasenjs/rn-dom') {
          return { filePath: path.join(rnDomRoot, 'dist/index.js'), type: 'sourceFile' }
        }
        if (moduleName === '@cat5th/vue-rn') {
          return { filePath: path.join(vueRNRoot, 'dist/index.js'), type: 'sourceFile' }
        }
        if (moduleName === '@cat5th/vue-rn/router') {
          return { filePath: path.join(vueRNRoot, 'dist/router.js'), type: 'sourceFile' }
        }

        return context.resolveRequest(context, moduleName, platform)
      },
    },
    watchFolders: [...new Set([...baseWatchFolders, vueRNRoot, rnDomRoot])],
  }
}

export default withVueRN
