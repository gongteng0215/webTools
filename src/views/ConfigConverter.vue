<script setup>
import { ref, watch, onMounted } from 'vue'
import * as yaml from 'js-yaml'
import * as dotProp from 'dot-properties'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const input = ref('server:\n  port: 8080\n  servlet:\n    context-path: /api\nspring:\n  datasource:\n    url: jdbc:mysql://localhost:3306/db')
const output = ref('')
const sourceFormat = ref('yaml')
const targetFormat = ref('properties')
const error = ref('')

const convert = () => {
  if (!input.value || !input.value.trim()) {
    output.value = ''
    error.value = ''
    return
  }

  try {
    error.value = ''
    let data

    // 1. Parse Source to Object
    if (sourceFormat.value === 'yaml') {
      data = yaml.load(input.value)
    } else if (sourceFormat.value === 'json') {
      data = JSON.parse(input.value)
    } else if (sourceFormat.value === 'properties') {
      const flat = dotProp.parse(input.value)
      data = {}
      for (const key in flat) {
        setDeep(data, key, flat[key])
      }
    }

    if (!data) {
      output.value = ''
      return
    }

    // 2. Stringify Object to Target
    if (targetFormat.value === 'json') {
      output.value = JSON.stringify(data, null, 2)
    } else if (targetFormat.value === 'yaml') {
      output.value = yaml.dump(data)
    } else if (targetFormat.value === 'properties') {
      const flat = {}
      flatten(data, '', flat)
      output.value = dotProp.stringify(flat)
    }
  } catch (e) {
    error.value = t('home.tools.config.error', { e: e.message })
    output.value = ''
    console.error(e)
  }
}

// Helpers for Properties nesting/flattening
const setDeep = (obj, path, value) => {
  const keys = path.split('.')
  let current = obj
  while (keys.length > 1) {
    const key = keys.shift()
    if (!current[key]) current[key] = {}
    current = current[key]
  }
  current[keys[0]] = value
}

const flatten = (obj, prefix, res) => {
  for (const key in obj) {
    const prop = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flatten(obj[key], prop, res)
    } else {
      res[prop] = obj[key]
    }
  }
}

const swap = () => {
  const temp = sourceFormat.value
  sourceFormat.value = targetFormat.value
  targetFormat.value = temp
  input.value = output.value
  convert()
}

const clearInput = () => {
  input.value = ''
  output.value = ''
  error.value = ''
}

const copyOutput = () => {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  alert(t('common.copied'))
}

watch([input, sourceFormat, targetFormat], convert, { immediate: true })

onMounted(() => {
  convert()
})
</script>

<template>
  <div class="tool-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="tool-card">
      <div class="tool-header">
        <h1 class="title">{{ t('home.tools.config.title') }}</h1>
        <div class="actions">
          <button @click="clearInput" class="btn-sub">{{ t('common.clear') }}</button>
        </div>
      </div>

      <div class="format-controls">
        <div class="control-group">
          <label>{{ t('home.tools.config.source') }}</label>
          <select v-model="sourceFormat">
            <option value="yaml">YAML</option>
            <option value="json">JSON</option>
            <option value="properties">Properties</option>
          </select>
        </div>
        
        <button @click="swap" class="btn-swap" :title="t('common.action')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 1l4 4-4 4"></path>
            <path d="M3 19l4 4 4-4"></path>
            <path d="M21 5H3"></path>
            <path d="M3 19h18"></path>
          </svg>
        </button>

        <div class="control-group">
          <label>{{ t('home.tools.config.target') }}</label>
          <select v-model="targetFormat">
            <option value="properties">Properties</option>
            <option value="yaml">YAML</option>
            <option value="json">JSON</option>
          </select>
        </div>
      </div>

      <div class="editor-area">
        <div class="pane">
          <div class="pane-header">
            <label>{{ t('common.input') }} ({{ sourceFormat.toUpperCase() }})</label>
          </div>
          <textarea v-model="input" :placeholder="t('home.tools.config.placeholder')"></textarea>
          <div v-if="error" class="error-msg">{{ error }}</div>
        </div>

        <div class="pane">
          <div class="pane-header">
            <label>{{ t('common.output') }} ({{ targetFormat.toUpperCase() }})</label>
            <button v-if="output" @click="copyOutput" class="btn-copy-inline">{{ t('common.copy') }}</button>
          </div>
          <textarea v-model="output" readonly :placeholder="t('common.output') + '...'"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { width: 100%; max-width: 1100px; margin: 0 auto; }
.btn-back { text-decoration: none; color: #05c46b; font-weight: bold; margin-bottom: 20px; display: inline-block; }

.tool-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; }

.tool-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.title { font-size: 1.5rem; margin: 0; color: #2d3436; }

.format-controls { 
  display: flex; align-items: center; justify-content: center; gap: 30px; 
  margin-bottom: 30px; background: #f8f9fa; padding: 20px; border-radius: 12px;
  border: 1px solid #eee;
}
.control-group { display: flex; align-items: center; gap: 15px; }
.control-group label { font-size: 0.9rem; color: #636e72; font-weight: bold; }
.control-group select { 
  padding: 8px 15px; border: 1px solid #ddd; border-radius: 6px; 
  background: white; cursor: pointer; outline: none; font-weight: bold; color: #2d3436;
}

.btn-swap { 
  background: white; border: 1px solid #ddd; padding: 8px; border-radius: 50%; 
  cursor: pointer; display: flex; align-items: center; justify-content: center; 
  transition: all 0.2s; color: #05c46b;
}
.btn-swap:hover { border-color: #05c46b; transform: scale(1.1); box-shadow: 0 2px 10px rgba(5, 196, 107, 0.2); }
.btn-swap svg { width: 22px; height: 22px; }

.editor-area { display: flex; gap: 20px; height: 500px; }
.pane { flex: 1; display: flex; flex-direction: column; position: relative; }
.pane-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.pane-header label { font-size: 0.75rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }

textarea { 
  flex: 1; border: 1px solid #eee; border-radius: 8px; padding: 15px; 
  font-family: 'Fira Code', 'Monaco', monospace; font-size: 0.9rem; 
  background: #fafafa; resize: none; overflow-y: auto; outline: none; line-height: 1.6;
}
textarea:focus { border-color: #05c46b; background: #fff; }
textarea[readonly] { background: #fdfdfd; cursor: default; }

.error-msg { 
  position: absolute; bottom: 10px; left: 10px; right: 10px; 
  background: #fff5f5; color: #d63031; padding: 10px 15px; border-radius: 6px; 
  font-size: 0.85rem; border-left: 5px solid #d63031; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 10;
}

.btn-copy-inline { 
  background: #05c46b; color: white; border: none; padding: 4px 12px; 
  border-radius: 4px; font-size: 0.75rem; cursor: pointer; font-weight: bold;
}
.btn-sub { 
  background: #f1f2f6; border: 1px solid #ddd; padding: 6px 15px; 
  border-radius: 6px; cursor: pointer; font-size: 0.85rem; color: #636e72;
}
</style>
