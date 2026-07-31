export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  app: {
    head: {
      title: 'Vue RN — 用 Vue 3 写 React Native',
      meta: [
        { name: 'description', content: 'Vue 3 自定义渲染器，将 Vue 渲染到 React Native Fabric' },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/logo.png' }],
    },
  },
  modules: ['@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'zh',
    langDir: 'locales',
    locales: [
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
  },
  css: ['~/assets/main.css'],
})
