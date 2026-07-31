/**
 * @cat5th/vue-rn-demo — Metro entry point
 *
 * 消费者示例：从 npm 安装的 @cat5th/vue-rn 包启动 Vue 3 RN 应用。
 *
 * No manual native component imports needed here.
 * @rasenjs/rn-dom auto-registers them via _resolveNativeName.
 */

if (typeof window === 'undefined') (globalThis as any).window = globalThis
if (typeof performance === 'undefined') (globalThis as any).performance = { now: () => Date.now() }

import 'react-native'
// Ensure codegen native components are registered before first render.
// (Their viewConfigs are registered as a module-load side effect.)
import 'react-native/Libraries/Components/Switch/SwitchNativeComponent'
import 'react-native/Libraries/Components/ScrollView/ScrollViewNativeComponent'

import { name as appName } from './app.json'
import { createApp } from '@cat5th/vue-rn'
import App from './App.vue'
import { router } from './router'

createApp(App)
  .use(router)
  .register(appName)

// Navigate from START_LOCATION to the home route
router.push('/')
