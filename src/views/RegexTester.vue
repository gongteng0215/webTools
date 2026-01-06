<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const regexStr = ref('([a-z0-9_.-]+)@([a-z0-9.-]+)\\.([a-z.]{2,6})')
const flags = ref('g')
const testText = ref('My emails are test@example.com and dev.ops-123@google.co.uk. Please feel free to match them!')
const error = ref('')

const commonRegex = computed(() => [
  { name: t('regex.templates.email'), val: '([a-z0-9_.-]+)@([a-z0-9.-]+)\\.([a-z.]{2,6})', flags: 'g' },
  { name: t('regex.templates.phone'), val: '1[3-9]\\d{9}', flags: 'g' },
  { name: t('regex.templates.ip'), val: '((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}', flags: 'g' },
  { name: t('regex.templates.url'), val: 'https?://[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-_~:/?#[\\]@!$&\'()*+,;=.]+', flags: 'g' }
])

const highlightedText = computed(() => {
  if (!regexStr.value || !testText.value) return testText.value
  
  try {
    error.value = ''
    const re = new RegExp(regexStr.value, flags.value)
    
    let lastIndex = 0
    let parts = []
    let match
    
    const searchRe = new RegExp(regexStr.value, flags.value.includes('g') ? flags.value : flags.value + 'g')
    
    while ((match = searchRe.exec(testText.value)) !== null) {
      if (match.index > lastIndex) {
        parts.push(testText.value.substring(lastIndex, match.index))
      }
      parts.push(`<span class="match-highlight">${match[0]}</span>`)
      lastIndex = searchRe.lastIndex
      
      if (match[0].length === 0) searchRe.lastIndex++
    }
    
    if (lastIndex < testText.value.length) {
      parts.push(testText.value.substring(lastIndex))
    }
    
    return parts.join('')
  } catch (e) {
    error.value = e.message
    return testText.value
  }
})

const applyTemplate = (tpl) => {
  regexStr.value = tpl.val
  flags.value = tpl.flags
}
</script>

<template>
  <div class="view-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="tool-card">
      <h1 class="title">{{ t('home.tools.regex.title') }}</h1>

      <div class="regex-input-section">
        <div class="input-line">
          <span class="slash">/</span>
          <input v-model="regexStr" :placeholder="t('home.tools.regex.regex')" class="regex-main" spellcheck="false">
          <span class="slash">/</span>
          <input v-model="flags" placeholder="flags" class="regex-flags" title="g, i, m, s, u, y" spellcheck="false">
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
      </div>

      <div class="templates">
        <span class="label">{{ t('regex.templates.email') }}:</span>
        <button v-for="tpl in commonRegex" :key="tpl.name" @click="applyTemplate(tpl)" class="btn-tpl">
          {{ tpl.name }}
        </button>
      </div>

      <div class="test-area">
        <div class="pane">
          <label>{{ t('regex.text') }}</label>
          <textarea v-model="testText" :placeholder="t('regex.text') + '...'" spellcheck="false"></textarea>
        </div>
        <div class="pane preview-pane">
          <label>{{ t('regex.result') }}</label>
          <div class="highlight-box" v-html="highlightedText"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container { width: 100%; max-width: 1100px; margin: 0 auto; }
.back-nav { margin-bottom: 20px; }
.btn-back { text-decoration: none; color: #fd79a8; font-weight: bold; }

.tool-card {
  background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px;
}

.title { font-size: 1.5rem; margin: 0 0 25px; color: #2d3436; }

.regex-input-section { margin-bottom: 20px; }
.input-line { display: flex; align-items: center; background: #f1f2f6; padding: 10px 20px; border-radius: 8px; border: 2px solid #dfe6e9; }
.slash { font-size: 1.5rem; color: #b2bec3; font-family: monospace; }
.regex-main { flex: 1; border: none; background: transparent; font-family: 'Fira Code', monospace; font-size: 1.2rem; padding: 0 10px; outline: none; color: #e84393; }
.regex-flags { width: 80px; border: none; background: transparent; font-family: 'Fira Code', monospace; font-size: 1.1rem; border-left: 1px solid #ddd; padding-left: 10px; outline: none; color: #636e72; }

.error-msg { margin-top: 8px; font-size: 0.85rem; color: #d63031; background: #fff5f5; padding: 5px 10px; border-radius: 4px; border-left: 4px solid #d63031; }

.templates { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 25px; align-items: center; }
.templates .label { font-size: 0.8rem; color: #b2bec3; margin-right: 5px; text-transform: uppercase; font-weight: bold; }
.btn-tpl { background: #f9f9f9; border: 1px solid #eee; padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; color: #636e72; }
.btn-tpl:hover { background: #fd79a8; color: white; border-color: #fd79a8; }

.test-area { display: flex; gap: 20px; height: 500px; }
.pane { flex: 1; display: flex; flex-direction: column; }
.pane label { font-size: 0.75rem; color: #b2bec3; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
textarea { flex: 1; border: 1px solid #eee; border-radius: 8px; padding: 15px; font-family: 'Fira Code', monospace; font-size: 0.95rem; resize: none; outline: none; background: #fafafa; line-height: 1.6; }
textarea:focus { background: white; border-color: #fd79a8; }

.preview-pane { background: white; }
.highlight-box {
  flex: 1; border: 1px solid #eee; border-radius: 8px; padding: 15px; font-family: 'Fira Code', monospace;
  font-size: 0.95rem; overflow-y: auto; white-space: pre-wrap; word-break: break-all; background: white; line-height: 1.6;
}

:deep(.match-highlight) { background: rgba(253, 121, 168, 0.2); border-bottom: 2px solid #fd79a8; color: #d63031; font-weight: bold; }
</style>
