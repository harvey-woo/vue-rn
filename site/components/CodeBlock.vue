<template>
  <div class="code-block">
    <div v-if="file" class="code-block-header">
      <span class="code-block-dot" />
      <span class="code-block-file">{{ file }}</span>
    </div>
    <pre :class="`language-${language}`"><code v-html="highlighted" /></pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import hljs from 'highlight.js/lib/common'
import 'highlight.js/styles/github-dark.css'

const props = defineProps<{
  code: string
  file?: string
  language?: string
}>()

const language = computed(() => props.language ?? detectLanguage(props.file))

const highlighted = computed(() => {
  try {
    const lang = language.value
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(props.code, { language: lang }).value
    }
    return hljs.highlightAuto(props.code).value
  } catch {
    // 高亮失败时回退为纯文本（转义 HTML 防注入）
    return props.code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }
})

function detectLanguage(file?: string): string {
  if (!file) return 'text'
  if (file.endsWith('.vue')) return 'xml'
  if (file.endsWith('.js')) return 'javascript'
  if (file.endsWith('.ts')) return 'typescript'
  if (file.endsWith('.json')) return 'json'
  if (file.endsWith('.sh') || file.endsWith('bash')) return 'bash'
  return 'text'
}
</script>

<style scoped>
.code-block {
  border-radius: 10px;
  overflow: hidden;
  background: #0f0f1a;
  border: 1px solid #2a2a3e;
  margin: 12px 0;
}
.code-block-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #16162a;
  border-bottom: 1px solid #2a2a3e;
}
.code-block-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff5f57;
  box-shadow: 14px 0 0 #febc2e, 28px 0 0 #28c840;
}
.code-block-file {
  margin-left: 28px;
  color: #888899;
  font-size: 13px;
  font-family: 'SF Mono', 'JetBrains Mono', Menlo, monospace;
}
.code-block pre {
  margin: 0;
  padding: 16px;
  background: transparent !important;
  border-radius: 0;
}
.code-block code {
  font-size: 13px;
  line-height: 1.6;
}
</style>
