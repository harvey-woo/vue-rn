<template>
  <div>
    <header class="header">
      <div class="container header-inner">
        <a href="/" class="logo">
          <img src="/logo.png" alt="Vue RN" width="32" height="32" />
          <span>Vue&nbsp;RN</span>
        </a>
        <nav class="nav">
          <a href="/docs">{{ $t('nav.docs') }}</a>
          <a href="https://github.com/harvey-woo/vue-rn" target="_blank" rel="noopener">GitHub</a>
        </nav>
      </div>
    </header>
    <main>
      <slot />
    </main>
    <footer class="footer">
      <div class="container">
        <p>{{ $t('footer.madeWith') }}</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.header {
  border-bottom: 1px solid #e8e8ef;
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #1a1a2e;
}
.logo:hover { text-decoration: none; }
.nav {
  display: flex;
  gap: 24px;
}
.footer {
  border-top: 1px solid #e8e8ef;
  padding: 24px 0;
  margin-top: 64px;
  color: #888;
  font-size: 14px;
}
</style>
