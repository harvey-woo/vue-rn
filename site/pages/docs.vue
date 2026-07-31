<template>
  <div class="container docs">
    <h1>{{ $t('nav.docs') }}</h1>
    <p class="docs-intro">{{ $t('docs.intro') }}</p>

    <div class="doc-list">
      <a
        v-for="doc in docs"
        :key="doc.title"
        class="doc-card"
        :href="doc.url"
        target="_blank"
        rel="noopener"
      >
        <h3>{{ doc.title }}</h3>
        <p>{{ doc.desc }}</p>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const docs = [
  {
    title: t('docs.gettingStarted'),
    desc: t('docs.gettingStartedDesc'),
    url: 'https://github.com/harvey-woo/vue-rn/blob/main/docs/getting-started.md',
  },
  {
    title: t('docs.router'),
    desc: t('docs.routerDesc'),
    url: 'https://github.com/harvey-woo/vue-rn/blob/main/docs/router.md',
  },
  {
    title: t('docs.transformer'),
    desc: t('docs.transformerDesc'),
    url: 'https://github.com/harvey-woo/vue-rn/blob/main/docs/transformer.md',
  },
  {
    title: t('docs.native'),
    desc: t('docs.nativeDesc'),
    url: 'https://github.com/harvey-woo/vue-rn/blob/main/docs/native.md',
  },
  {
    title: t('docs.api'),
    desc: t('docs.apiDesc'),
    url: 'https://github.com/harvey-woo/vue-rn/blob/main/docs/api.md',
  },
]
</script>

<style scoped>
.docs {
  padding: 64px 24px;
}
.docs h1 {
  font-size: 36px;
  margin-bottom: 12px;
}
.docs-intro {
  color: #666;
  margin-bottom: 40px;
}
.doc-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
.doc-card {
  border: 1px solid #e8e8ef;
  border-radius: 12px;
  padding: 20px;
  color: inherit;
  transition: border-color 0.2s;
}
.doc-card:hover {
  border-color: #16c79a;
  text-decoration: none;
}
.doc-card h3 {
  font-size: 16px;
  margin-bottom: 6px;
  color: #1a1a2e;
}
.doc-card p {
  font-size: 14px;
  color: #666;
}
</style>
