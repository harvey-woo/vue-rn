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
        <p class="code-subtitle">{{ $t('code.subtitle') }}</p>

        <div class="steps">
          <!-- Step 1: Install -->
          <div class="step">
            <div class="step-header">
              <span class="step-number">1</span>
              <div class="step-info">
                <h3>{{ $t('code.steps.install.title') }}</h3>
                <p>{{ $t('code.steps.install.desc') }}</p>
              </div>
            </div>
            <CodeBlock
              :code="installCode"
              :file="$t('code.file.bash')"
              language="bash"
            />
          </div>

          <!-- Step 2: Metro -->
          <div class="step">
            <div class="step-header">
              <span class="step-number">2</span>
              <div class="step-info">
                <h3>{{ $t('code.steps.metro.title') }}</h3>
                <p>{{ $t('code.steps.metro.desc') }}</p>
              </div>
            </div>
            <CodeBlock
              :code="metroCode"
              :file="$t('code.file.metro')"
              language="javascript"
            />
          </div>

          <!-- Step 3: Entry -->
          <div class="step">
            <div class="step-header">
              <span class="step-number">3</span>
              <div class="step-info">
                <h3>{{ $t('code.steps.entry.title') }}</h3>
                <p>{{ $t('code.steps.entry.desc') }}</p>
              </div>
            </div>
            <CodeBlock
              :code="entryCode"
              :file="$t('code.file.entry')"
              language="typescript"
            />
          </div>

          <!-- Step 4: Component -->
          <div class="step">
            <div class="step-header">
              <span class="step-number">4</span>
              <div class="step-info">
                <h3>{{ $t('code.steps.component.title') }}</h3>
                <p>{{ $t('code.steps.component.desc') }}</p>
              </div>
            </div>
            <CodeBlock
              :code="componentCode"
              :file="$t('code.file.component')"
              language="xml"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const featureKeys = ['renderer', 'fabric', 'router', 'sfc', 'hmr', 'css']

const installCode = `npm install @cat5th/vue-rn @rasenjs/rn-dom vue vue-router`

const metroCode = `const { getDefaultConfig } = require('@react-native/metro-config')
const { withVueRN } = require('@cat5th/vue-rn/metro')

module.exports = withVueRN(getDefaultConfig(__dirname))`

const entryCode = `import { createApp } from '@cat5th/vue-rn'
import App from './App.vue'
import { name as appName } from './app.json'

createApp(App).register(appName)`

const componentCode = `\u003Cscript setup lang="ts"\u003E
import { ref } from 'vue'
const count = ref(0)
\u003C/script\u003E

\u003Ctemplate\u003E
  \u003CView :style="{ flex: 1, justifyContent: 'center', alignItems: 'center' }"\u003E
    \u003CText :style="{ fontSize: 24, fontWeight: 'bold' }"\u003E
      Hello Vue 3 + RN!
    \u003C/Text\u003E
  \u003C/View\u003E
\u003C/template\u003E`
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
.code-subtitle {
  text-align: center;
  color: #888;
  margin-top: -24px;
  margin-bottom: 40px;
}
.steps {
  max-width: 720px;
  margin: 0 auto;
}
.step {
  margin-bottom: 32px;
}
.step-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}
.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #16c79a;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
}
.step-info h3 {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 2px;
}
.step-info p {
  color: #888;
  font-size: 14px;
}
</style>
