<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast } from '../utils/toast'

const { t } = useI18n()

// Request State
const method = ref('GET')
const url = ref('https://jsonplaceholder.typicode.com/posts/1')
const activeTab = ref('params')
const bodyType = ref('json')

const params = reactive([{ key: '', value: '', enabled: true }])
const headers = reactive([
  { key: 'Content-Type', value: 'application/json', enabled: true },
  { key: '', value: '', enabled: true }
])
const formDataRows = reactive([{ key: '', value: '', enabled: true }])
const bodyContent = ref('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}')

// Response State
const response = reactive({
  status: null,
  statusText: '',
  time: null,
  size: null,
  headers: {},
  body: '',
  error: null
})
const isLoading = ref(false)
const responseTab = ref('body')

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

// Computed URL with params
const fullUrl = computed(() => {
  try {
    const baseUrl = new URL(url.value)
    params.forEach(p => {
      if (p.enabled && p.key) {
        baseUrl.searchParams.set(p.key, p.value)
      }
    })
    return baseUrl.toString()
  } catch {
    return url.value
  }
})

// Add/Remove rows
const addRow = (arr) => {
  arr.push({ key: '', value: '', enabled: true })
}
const removeRow = (arr, index) => {
  if (arr.length > 1) arr.splice(index, 1)
}

// Send Request
const sendRequest = async () => {
  isLoading.value = true
  response.status = null
  response.statusText = ''
  response.time = null
  response.size = null
  response.headers = {}
  response.body = ''
  response.error = null

  const startTime = performance.now()

  try {
    // Build headers from user input, excluding Content-Type (we'll set it based on body type)
    const reqHeaders = {}
    headers.forEach(h => {
      if (h.enabled && h.key && h.key.toLowerCase() !== 'content-type') {
        reqHeaders[h.key] = h.value
      }
    })

    const options = {
      method: method.value
    }

    // Add body for non-GET/HEAD requests
    if (!['GET', 'HEAD'].includes(method.value) && bodyContent.value.trim()) {
      if (bodyType.value === 'json') {
        reqHeaders['Content-Type'] = 'application/json'
        options.body = bodyContent.value
      } else if (bodyType.value === 'text') {
        reqHeaders['Content-Type'] = 'text/plain'
        options.body = bodyContent.value
      } else if (bodyType.value === 'formdata') {
        // For FormData, browser sets Content-Type automatically with boundary
        const formData = new FormData()
        formDataRows.forEach(row => {
          if (row.enabled && row.key) {
            formData.append(row.key, row.value)
          }
        })
        options.body = formData
        // Don't set Content-Type for FormData - browser handles it
      }
    }

    // Only set headers if we have any
    if (Object.keys(reqHeaders).length > 0) {
      options.headers = reqHeaders
    }

    const res = await fetch(fullUrl.value, options)
    const endTime = performance.now()

    response.status = res.status
    response.statusText = res.statusText
    response.time = Math.round(endTime - startTime)

    // Collect headers
    const resHeaders = {}
    res.headers.forEach((value, key) => {
      resHeaders[key] = value
    })
    response.headers = resHeaders

    // Get body
    const text = await res.text()
    response.size = new Blob([text]).size
    
    // Try to parse as JSON for pretty print
    try {
      const json = JSON.parse(text)
      response.body = JSON.stringify(json, null, 2)
    } catch {
      response.body = text
    }

  } catch (err) {
    response.error = err.message || 'Network Error'
    if (err.message?.includes('Failed to fetch')) {
      response.error = t('home.tools.api.corsError')
    }
  } finally {
    isLoading.value = false
  }
}

const copyResponse = () => {
  if (!response.body) return
  navigator.clipboard.writeText(response.body)
  showToast(t('common.copied'))
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  return (bytes / 1024).toFixed(2) + ' KB'
}

const statusClass = computed(() => {
  if (!response.status) return ''
  if (response.status < 300) return 'status-success'
  if (response.status < 400) return 'status-redirect'
  if (response.status < 500) return 'status-client-error'
  return 'status-server-error'
})
</script>

<template>
  <div class="api-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="api-card">
      <h1 class="title">{{ t('home.tools.api.title') }}</h1>

      <!-- Request Builder -->
      <div class="request-bar">
        <select v-model="method" class="method-select" :class="method.toLowerCase()">
          <option v-for="m in methods" :key="m" :value="m">{{ m }}</option>
        </select>
        <input v-model="url" type="text" class="url-input" placeholder="Enter request URL" />
        <button @click="sendRequest" class="btn-send" :disabled="isLoading">
          {{ isLoading ? t('home.tools.api.sending') : t('home.tools.api.send') }}
        </button>
      </div>

      <!-- Request Tabs -->
      <div class="tabs">
        <button :class="{ active: activeTab === 'params' }" @click="activeTab = 'params'">
          {{ t('home.tools.api.params') }}
        </button>
        <button :class="{ active: activeTab === 'headers' }" @click="activeTab = 'headers'">
          {{ t('home.tools.api.headers') }}
        </button>
        <button :class="{ active: activeTab === 'body' }" @click="activeTab = 'body'">
          {{ t('home.tools.api.body') }}
        </button>
      </div>

      <!-- Params Tab -->
      <div v-if="activeTab === 'params'" class="tab-content">
        <div v-for="(p, i) in params" :key="i" class="kv-row">
          <input type="checkbox" v-model="p.enabled" />
          <input v-model="p.key" :placeholder="t('home.tools.api.key')" />
          <input v-model="p.value" :placeholder="t('home.tools.api.value')" />
          <button @click="removeRow(params, i)" class="btn-remove">×</button>
        </div>
        <button @click="addRow(params)" class="btn-add">+ {{ t('home.tools.api.addRow') }}</button>
      </div>

      <!-- Headers Tab -->
      <div v-if="activeTab === 'headers'" class="tab-content">
        <div v-for="(h, i) in headers" :key="i" class="kv-row">
          <input type="checkbox" v-model="h.enabled" />
          <input v-model="h.key" :placeholder="t('home.tools.api.key')" />
          <input v-model="h.value" :placeholder="t('home.tools.api.value')" />
          <button @click="removeRow(headers, i)" class="btn-remove">×</button>
        </div>
        <button @click="addRow(headers)" class="btn-add">+ {{ t('home.tools.api.addRow') }}</button>
      </div>

      <!-- Body Tab -->
      <div v-if="activeTab === 'body'" class="tab-content">
        <div class="body-type-selector">
          <label><input type="radio" v-model="bodyType" value="json" /> JSON</label>
          <label><input type="radio" v-model="bodyType" value="text" /> {{ t('home.tools.api.rawText') }}</label>
          <label><input type="radio" v-model="bodyType" value="formdata" /> {{ t('home.tools.api.formData') }}</label>
        </div>
        
        <!-- JSON / Raw Text: Textarea -->
        <textarea 
          v-if="bodyType === 'json' || bodyType === 'text'" 
          v-model="bodyContent" 
          class="body-editor" 
          spellcheck="false" 
          :placeholder="bodyType === 'json' ? '{}' : 'Enter raw text...'"
        ></textarea>
        
        <!-- Form Data: Key-Value Rows -->
        <div v-if="bodyType === 'formdata'" class="form-data-editor">
          <div v-for="(row, i) in formDataRows" :key="i" class="kv-row">
            <input type="checkbox" v-model="row.enabled" />
            <input v-model="row.key" :placeholder="t('home.tools.api.key')" />
            <input v-model="row.value" :placeholder="t('home.tools.api.value')" />
            <button @click="removeRow(formDataRows, i)" class="btn-remove">×</button>
          </div>
          <button @click="addRow(formDataRows)" class="btn-add">+ {{ t('home.tools.api.addRow') }}</button>
        </div>
      </div>

      <!-- Response Section -->
      <div class="response-section" v-if="response.status || response.error">
        <div class="response-meta">
          <span v-if="response.status" :class="['status-badge', statusClass]">
            {{ response.status }} {{ response.statusText }}
          </span>
          <span v-if="response.time" class="meta-item">⏱ {{ response.time }} ms</span>
          <span v-if="response.size" class="meta-item">📦 {{ formatSize(response.size) }}</span>
          <button v-if="response.body" @click="copyResponse" class="btn-copy">{{ t('common.copy') }}</button>
        </div>

        <div v-if="response.error" class="error-msg">{{ response.error }}</div>

        <div v-else class="response-tabs">
          <button :class="{ active: responseTab === 'body' }" @click="responseTab = 'body'">
            {{ t('home.tools.api.body') }}
          </button>
          <button :class="{ active: responseTab === 'headers' }" @click="responseTab = 'headers'">
            {{ t('home.tools.api.headers') }}
          </button>
        </div>

        <pre v-if="responseTab === 'body' && !response.error" class="response-body">{{ response.body }}</pre>
        
        <div v-if="responseTab === 'headers' && !response.error" class="response-headers">
          <div v-for="(val, key) in response.headers" :key="key" class="header-row">
            <span class="header-key">{{ key }}:</span>
            <span class="header-value">{{ val }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.api-container { width: 100%; max-width: 1100px; margin: 0 auto; }
.back-nav { margin-bottom: 20px; }
.btn-back { text-decoration: none; color: var(--primary); font-weight: bold; }

.api-card { 
  background: white; border-radius: 12px; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; 
}
.title { font-size: 1.5rem; margin: 0 0 25px; color: #2d3436; }

/* Request Bar */
.request-bar { display: flex; gap: 10px; margin-bottom: 20px; }
.method-select { 
  padding: 12px 15px; border: 1px solid var(--primary-border); border-radius: 8px; 
  font-weight: bold; cursor: pointer; background: #f8f9fa; min-width: 100px;
  outline: none;
}
.method-select.get { color: var(--primary); }
.method-select.post { color: var(--primary); }
.method-select.put { color: var(--primary); }
.method-select.patch { color: var(--primary); }
.method-select.delete { color: var(--primary); }

.url-input { 
  flex: 1; padding: 12px 15px; border: 1px solid var(--primary-border); border-radius: 8px; 
  font-size: 0.95rem; outline: none; transition: border-color 0.2s;
}
.url-input:focus { border-color: var(--primary); }

.btn-send { 
  padding: 12px 30px; background: var(--primary); color: white; border: none; 
  border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.2s;
}
.btn-send:hover { background: var(--primary-hover); }
.btn-send:disabled { background: #b2bec3; cursor: not-allowed; }

/* Tabs */
.tabs { display: flex; gap: 5px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.tabs button { 
  padding: 8px 20px; background: none; border: none; cursor: pointer; 
  font-size: 0.9rem; color: var(--text-muted); border-radius: 6px; transition: all 0.2s;
}
.tabs button:hover { background: #f8f9fa; }
.tabs button.active { background: var(--primary); color: white; }

/* Tab Content */
.tab-content { background: #f8f9fa; border-radius: 8px; padding: 15px; min-height: 120px; }

.kv-row { 
  display: flex; align-items: center; gap: 10px; margin-bottom: 8px; 
}
.kv-row input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary); }
.kv-row input[type="text"] { 
  flex: 1; padding: 8px 12px; border: 1px solid var(--primary-border); border-radius: 6px; 
  font-size: 0.85rem; outline: none;
}
.kv-row input[type="text"]:focus { border-color: var(--primary); }
.btn-remove { 
  width: 28px; height: 28px; border: none; background: var(--primary); color: white; 
  border-radius: 4px; cursor: pointer; font-size: 1.1rem; line-height: 1;
}
.btn-add { 
  padding: 6px 15px; background: var(--primary-soft); border: 1px solid var(--primary-border); border-radius: 6px; 
  cursor: pointer; font-size: 0.85rem; color: var(--primary); margin-top: 5px;
}
.btn-add:hover { background: var(--primary); color: white; }

/* Body Editor */
.body-type-selector { margin-bottom: 10px; display: flex; gap: 20px; }
.body-type-selector label { display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 0.9rem; }
.body-type-selector input { accent-color: var(--primary); }
.body-editor { 
  width: 100%; height: 150px; border: 1px solid var(--primary-border); border-radius: 8px; 
  padding: 12px; font-family: 'Fira Code', monospace; font-size: 0.85rem; 
  resize: vertical; outline: none; background: white;
}
.body-editor:focus { border-color: var(--primary); }

/* Response Section */
.response-section { margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }

.response-meta { 
  display: flex; align-items: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;
}
.status-badge { 
  padding: 6px 15px; border-radius: 20px; font-weight: bold; font-size: 0.85rem;
}
.status-success { background: #d4edda; color: #155724; }
.status-redirect { background: #fff3cd; color: #856404; }
.status-client-error { background: #f8d7da; color: #721c24; }
.status-server-error { background: #f5c6cb; color: #721c24; }

.meta-item { color: var(--text-muted); font-size: 0.85rem; }

.btn-copy { 
  margin-left: auto; padding: 6px 15px; background: var(--primary); color: white; 
  border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: bold;
}

.response-tabs { display: flex; gap: 5px; margin-bottom: 10px; }
.response-tabs button { 
  padding: 6px 15px; background: var(--primary-soft); border: 1px solid var(--primary-border); cursor: pointer; 
  font-size: 0.85rem; border-radius: 6px; color: var(--primary);
}
.response-tabs button.active { background: var(--primary); color: white; }

.response-body { 
  background: #2d3436; color: #dfe6e9; padding: 20px; border-radius: 8px; 
  font-family: 'Fira Code', monospace; font-size: 0.85rem; 
  max-height: 400px; overflow: auto; white-space: pre-wrap; word-break: break-all;
}

.response-headers { background: #f8f9fa; padding: 15px; border-radius: 8px; }
.header-row { padding: 6px 0; border-bottom: 1px solid #eee; font-size: 0.85rem; }
.header-row:last-child { border-bottom: none; }
.header-key { font-weight: bold; color: #2d3436; margin-right: 10px; }
.header-value { color: var(--text-muted); word-break: break-all; }

.error-msg { 
  background: #fff5f5; color: #d63031; padding: 15px; border-radius: 8px; 
  border-left: 4px solid #d63031; font-size: 0.9rem;
}
</style>
