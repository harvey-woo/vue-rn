// 注册 @cat5th/vue-rn 的 Web 兼容层组件（View/Text 等）
// 让官网页面可以直接使用 RN 风格的组件
import { webPlugin } from '@cat5th/vue-rn/web'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(webPlugin)
})
