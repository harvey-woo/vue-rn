<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-badge">{{ $t('hero.badge') }}</div>
        <h1 class="hero-title">{{ $t('hero.title') }}</h1>
        <p class="hero-subtitle">{{ $t('hero.subtitle') }}</p>
        <div class="hero-actions">
          <a href="/docs" class="btn btn-primary">{{ $t('hero.cta') }}</a>
          <a href="https://github.com/harvey-woo/vue-rn" target="_blank" rel="noopener" class="btn btn-ghost">{{ $t('hero.ctaDocs') }}</a>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">{{ $t('features.title') }}</h2>
        <div class="feature-grid">
          <div v-for="f in featureKeys" :key="f" class="feature-card">
            <h3>{{ t(`features.${f}.title`) }}</h3>
            <p>{{ t(`features.${f}.desc`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick start -->
    <section class="code-section">
      <div class="container">
        <h2 class="section-title">{{ $t('code.title') }}</h2>
        <pre><code>{{ quickStart }}</code></pre>
      </div>
    </section>

    <!-- Web components demo (uses @cat5th/vue-rn/web) -->
    <section class="web-demo">
      <div class="container">
        <h2 class="section-title">{{ $t('webDemo.title') }}</h2>
        <p class="web-demo-sub">{{ $t('webDemo.subtitle') }}</p>

        <View class="web-demo-card">
          <Text class="web-demo-heading">{{ $t('webDemo.cardTitle') }}</Text>
          <Text class="web-demo-text">{{ $t('webDemo.cardDesc') }}</Text>

          <View class="web-demo-row">
            <Pressable
              class="web-demo-btn"
              :style="{ backgroundColor: pressed ? '#0a8c6a' : '#16c79a' }"
              @press="handlePress"
            >
              <Text class="web-demo-btn-text">{{ pressed ? $t('webDemo.pressed') : $t('webDemo.pressMe') }}</Text>
            </Pressable>
          </View>

          <TextInput
            class="web-demo-input"
            :placeholder="$t('webDemo.inputPlaceholder')"
            :text="inputText"
            @change="(e) => (inputText = e?.text ?? '')"
          />
          <Text class="web-demo-text" v-if="inputText">{{ $t('webDemo.youTyped') }}: {{ inputText }}</Text>

          <View class="web-demo-row">
            <ActivityIndicator :style="{ marginRight: 8 }" />
            <Text class="web-demo-text">{{ $t('webDemo.loading') }}</Text>
          </View>
        </View>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Alert, Platform, StyleSheet } from '@cat5th/vue-rn/web'

const { t } = useI18n()
const featureKeys = ['renderer', 'fabric', 'router', 'sfc', 'hmr', 'css']
const pressed = ref(false)
const inputText = ref('')

// 验证 Platform API
const isWeb = Platform.OS === 'web'

// 验证 StyleSheet.create
const demoStyle = StyleSheet.create({
  card: { flex: 1, padding: 24 },
})

// 验证 Alert API（点击按钮时触发）
function handlePress() {
  pressed.value = !pressed.value
  if (pressed.value) {
    Alert.alert(
      'Vue RN Web',
      `Platform.OS = ${Platform.OS}${isWeb ? ' ✅' : ' ⚠️'}`,
    )
  }
}

const quickStart = `# 1. 安装
npm install @cat5th/vue-rn @rasenjs/rn-dom vue vue-router

# 2. Metro 配置（metro.config.js）
const { getDefaultConfig } = require('@react-native/metro-config')
const { withVueRN } = require('@cat5th/vue-rn/metro')
module.exports = withVueRN(getDefaultConfig(__dirname))

# 3. 入口（index.ts）
import { createApp } from '@cat5th/vue-rn'
import App from './App.vue'
import { name as appName } from './app.json'
createApp(App).register(appName)

# 4. 组件（App.vue）
\u003CView :style="{ flex: 1, justifyContent: 'center', alignItems: 'center' }">
  \u003CText>Hello Vue 3 + RN!\u003C/Text>
\u003C/View>`
</script>

<style scoped>
.hero {
  background: linear-gradient(180deg, #f6f6fa 0%, #ffffff 100%);
  padding: 96px 0 72px;
  text-align: center;
}
.hero-badge {
  display: inline-block;
  background: #e6f9f4;
  color: #0a8c6a;
  border-radius: 999px;
  padding: 4px 16px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
}
.hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  max-width: 640px;
  margin: 0 auto 16px;
}
.hero-subtitle {
  font-size: 18px;
  color: #666;
  max-width: 560px;
  margin: 0 auto 32px;
}
.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.btn {
  display: inline-block;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
}
.btn-primary {
  background: #16c79a;
  color: #fff;
}
.btn-primary:hover {
  background: #0a8c6a;
  text-decoration: none;
}
.btn-ghost {
  border: 1px solid #d0d0d5;
  color: #1a1a2e;
}
.btn-ghost:hover {
  background: #f0f0f3;
  text-decoration: none;
}
.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
}
.features {
  padding: 72px 0;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
.feature-card {
  border: 1px solid #e8e8ef;
  border-radius: 12px;
  padding: 24px;
}
.feature-card h3 {
  font-size: 18px;
  margin-bottom: 8px;
}
.feature-card p {
  color: #666;
  font-size: 14px;
}
.code-section {
  padding: 0 0 72px;
}
.code-section pre {
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Web components demo (rendered by @cat5th/vue-rn/web) */
.web-demo {
  background: #0f0f1a;
  padding: 72px 0;
}
.web-demo .section-title {
  color: #e0e0ee;
}
.web-demo-sub {
  text-align: center;
  color: #888899;
  margin-bottom: 40px;
}
.web-demo-card {
  max-width: 480px;
  margin: 0 auto;
  background: #1a1a2e;
  border-radius: 16px;
  padding: 24px;
}
.web-demo-heading {
  color: #16c79a;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}
.web-demo-text {
  color: #b0b0c0;
  font-size: 14px;
  line-height: 20px;
}
.web-demo-row {
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
}
.web-demo-btn {
  background: #16c79a;
  border-radius: 8px;
  padding: 10px 20px;
  align-items: center;
  cursor: pointer;
}
.web-demo-btn-text {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}
.web-demo-input {
  margin-top: 16px;
  background: #0f0f1a;
  border-radius: 8px;
  padding: 10px 12px;
  color: #e0e0ee;
  font-size: 14px;
  border: 1px solid #2a2a3e;
  min-height: 40px;
}
</style>
