<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const urlInput = ref('https://www.example.com:8080/path/to/page?name=test&id=123#section-1')
const urlParts = reactive({
  protocol: '',
  host: '',
  port: '',
  pathname: '',
  search: '',
  hash: ''
})
const queryParams = ref([])

const parseUrl = () => {
  if (!urlInput.value.trim()) return
  
  try {
    const url = new URL(urlInput.value)
    urlParts.protocol = url.protocol
    urlParts.host = url.host
    urlParts.port = url.port || (url.protocol === 'https:' ? '443' : '80')
    urlParts.pathname = url.pathname
    urlParts.search = url.search
    urlParts.hash = url.hash
    
    const params = []
    url.searchParams.forEach((value, key) => {
      params.push({ key, value })
    })
    queryParams.value = params
  } catch (e) {
    // Ignore invalid URL during typing
  }
}

const updateUrl = () => {
  try {
    const url = new URL(urlInput.value)
    url.search = '' // Clear existing
    queryParams.value.forEach(p => {
      if (p.key) url.searchParams.append(p.key, p.value)
    })
    urlInput.value = url.toString()
    parseUrl()
  } catch (e) {}
}

const addParam = () => {
  queryParams.value.push({ key: '', value: '' })
}

const removeParam = (index) => {
  queryParams.value.splice(index, 1)
  updateUrl()
}

watch(urlInput, parseUrl, { immediate: true })
</script>

<template>
  <div class="tool-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="tool-card">
      <h1 class="title">{{ t('home.tools.url.title') }}</h1>

      <div class="input-section">
        <label>{{ t('home.tools.url.url') }}</label>
        <textarea v-model="urlInput" :placeholder="t('home.tools.url.url') + '...'" spellcheck="false"></textarea>
      </div>

      <div class="parts-grid">
        <div class="part-item">
          <label>Protocol</label>
          <input :value="urlParts.protocol" readonly>
        </div>
        <div class="part-item">
          <label>Host</label>
          <input :value="urlParts.host" readonly>
        </div>
        <div class="part-item">
          <label>Port</label>
          <input :value="urlParts.port" readonly>
        </div>
        <div class="part-item full">
          <label>{{ t('home.tools.url.path') }}</label>
          <input :value="urlParts.pathname" readonly>
        </div>
      </div>

      <div class="params-section">
        <div class="section-header">
          <h3>{{ t('home.tools.url.query') }}</h3>
          <button @click="addParam" class="btn-add">+ {{ t('home.tools.url.add') }}</button>
        </div>
        
        <div class="params-table">
          <div class="table-header">
            <span>{{ t('home.tools.url.key') }}</span>
            <span>{{ t('home.tools.url.val') }}</span>
            <span>{{ t('common.action') }}</span>
          </div>
          <div v-for="(p, index) in queryParams" :key="index" class="table-row">
            <input v-model="p.key" @input="updateUrl" :placeholder="t('home.tools.url.key')" spellcheck="false">
            <input v-model="p.value" @input="updateUrl" :placeholder="t('home.tools.url.val')" spellcheck="false">
            <button @click="removeParam(index)" class="btn-remove">×</button>
          </div>
          <div v-if="queryParams.length === 0" class="empty-hint">{{ t('home.tools.url.noParams') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { width: 100%; max-width: 1000px; margin: 0 auto; }
.btn-back { text-decoration: none; color: #1e3799; font-weight: bold; margin-bottom: 20px; display: inline-block; }

.tool-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; }
.title { font-size: 1.5rem; margin: 0 0 25px; color: #2d3436; }

.input-section { margin-bottom: 30px; }
.input-section label { display: block; font-size: 0.8rem; color: #b2bec3; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
textarea { width: 100%; height: 100px; padding: 15px; border: 2px solid #eee; border-radius: 8px; font-family: 'Fira Code', monospace; font-size: 1rem; background: #fafafa; resize: none; outline: none; transition: border-color 0.2s; }
textarea:focus { border-color: #1e3799; background: white; }

.parts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
.part-item { display: flex; flex-direction: column; gap: 8px; }
.part-item.full { grid-column: span 3; }
.part-item label { font-size: 0.75rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; }
.part-item input { padding: 12px; border: 1px solid #eee; border-radius: 6px; background: #fdfdfd; font-family: 'Fira Code', monospace; font-size: 0.9rem; color: #636e72; outline: none; }

.params-section { border-top: 1px solid #eee; padding-top: 25px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.section-header h3 { font-size: 1.1rem; color: #2d3436; margin: 0; }

.btn-add { background: #1e3799; color: white; border: none; padding: 6px 15px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: bold; }

.params-table { border: 1px solid #f1f1f1; border-radius: 8px; overflow: hidden; }
.table-header { display: grid; grid-template-columns: 1fr 1fr 60px; background: #fafafa; padding: 10px 15px; font-size: 0.75rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; }
.table-row { display: grid; grid-template-columns: 1fr 1fr 60px; padding: 8px 15px; border-top: 1px solid #f1f1f1; align-items: center; gap: 10px; }
.table-row input { border: 1px solid transparent; padding: 10px; font-family: 'Fira Code', monospace; font-size: 0.9rem; outline: none; border-radius: 4px; color: #2d3436; }
.table-row input:focus { background: #f8f9fa; border-color: #eee; }

.btn-remove { background: none; border: none; color: #ff7675; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0.6; transition: opacity 0.2s; }
.btn-remove:hover { opacity: 1; }

.empty-hint { text-align: center; padding: 30px; color: #b2bec3; font-size: 0.9rem; background: #fafafa; }
</style>
