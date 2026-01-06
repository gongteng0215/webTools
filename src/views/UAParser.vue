<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { UAParser } from 'ua-parser-js'

const { t } = useI18n()

const uaInput = ref('')
const results = ref(null)

const parseUA = () => {
  if (!uaInput.value) return
  const parser = new UAParser(uaInput.value)
  results.value = parser.getResult()
}

const useCurrent = () => {
  uaInput.value = navigator.userAgent
  parseUA()
}

const clear = () => {
  uaInput.value = ''
  results.value = null
}

onMounted(() => {
  useCurrent()
})
</script>

<template>
  <div class="view-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="card">
      <div class="header">
        <h1>{{ t('home.tools.ua.title') }}</h1>
        <div class="actions">
          <button @click="useCurrent" class="btn-sub">{{ t('home.tools.ua.current') }}</button>
          <button @click="clear" class="btn-sub">{{ t('common.clear') }}</button>
        </div>
      </div>

      <div class="ua-editor">
        <div class="input-section">
          <label>{{ t('home.tools.ua.placeholder') }}</label>
          <div class="input-group">
            <textarea v-model="uaInput" :placeholder="t('home.tools.ua.placeholder')" spellcheck="false" @input="parseUA"></textarea>
          </div>
        </div>

        <div v-if="results" class="results-grid">
          <div class="result-item">
            <div class="item-label">{{ t('home.tools.ua.results.browser') }}</div>
            <div class="item-value">{{ results.browser.name }} {{ results.browser.version }}</div>
          </div>
          <div class="result-item">
            <div class="item-label">{{ t('home.tools.ua.results.os') }}</div>
            <div class="item-value">{{ results.os.name }} {{ results.os.version }}</div>
          </div>
          <div class="result-item">
            <div class="item-label">{{ t('home.tools.ua.results.device') }}</div>
            <div class="item-value">{{ results.device.vendor || '-' }} {{ results.device.model || '-' }} ({{ results.device.type || 'desktop' }})</div>
          </div>
          <div class="result-item">
            <div class="item-label">{{ t('home.tools.ua.results.engine') }}</div>
            <div class="item-value">{{ results.engine.name }} {{ results.engine.version }}</div>
          </div>
          <div class="result-item">
            <div class="item-label">{{ t('home.tools.ua.results.cpu') }}</div>
            <div class="item-value">{{ results.cpu.architecture || '-' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container { width: 100%; max-width: 900px; margin: 0 auto; }
.back-nav { margin-bottom: 20px; }
.btn-back { text-decoration: none; color: #7c4dff; font-weight: bold; }

.card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.header h1 { margin: 0; font-size: 1.5rem; color: #2d3436; }

.ua-editor { display: flex; flex-direction: column; gap: 30px; }

.input-section { display: flex; flex-direction: column; gap: 10px; }
.input-section label { font-size: 0.8rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; }

textarea { 
  width: 100%; height: 100px; border: 1px solid #eee; border-radius: 8px; padding: 15px; 
  font-family: 'Fira Code', monospace; font-size: 0.95rem; background: #fafafa; 
  resize: none; outline: none; line-height: 1.6;
}
textarea:focus { border-color: #7c4dff; background: white; }

.results-grid { 
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; 
  padding: 20px; background: #f9f9f9; border-radius: 12px; border: 1px solid #eee;
}

.result-item { display: flex; flex-direction: column; gap: 5px; }
.item-label { font-size: 0.75rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; }
.item-value { font-size: 1.1rem; color: #2d3436; font-weight: 600; }

.actions { display: flex; gap: 10px; }
.btn-sub { 
  background: #f1f2f6; border: 1px solid #ddd; padding: 6px 15px; 
  border-radius: 6px; cursor: pointer; font-size: 0.85rem; color: #636e72;
}
.btn-sub:hover { background: #7c4dff; color: white; border-color: #7c4dff; }
</style>
