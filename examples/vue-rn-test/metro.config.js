const path = require('path')
const { getDefaultConfig } = require('@react-native/metro-config')
const { withVueRN } = require('@cat5th/vue-rn/metro')

// dev 模式（symlink 开发环境）专属：react-native 必须从例子自己的
// node_modules 解析，否则 symlink 下会与仓库根的 react-native 双实例。
// 插件会先调用此拦截；未命中时必须返回 undefined 让插件继续处理。
const exampleRoot = __dirname
const reactNativePath = path.join(exampleRoot, 'node_modules/react-native')

const defaultConfig = getDefaultConfig(__dirname)

defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native' || moduleName.startsWith('react-native/')) {
    const subPath = moduleName === 'react-native' ? 'index.js' : moduleName.slice('react-native/'.length) + '.js'
    return {
      filePath: path.join(reactNativePath, subPath),
      type: 'sourceFile',
    }
  }
  // 未命中：返回 undefined，交由插件（withVueRN）处理
  return undefined
}

module.exports = withVueRN(defaultConfig)
