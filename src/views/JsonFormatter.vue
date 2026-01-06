<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const input = ref('')
const output = ref('')
const error = ref('')

const format = () => {
  if (!input.value) return
  try {
    error.value = ''
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj, null, 2)
  } catch (e) {
    error.value = e.message
  }
}

const compress = () => {
  if (!input.value) return
  try {
    error.value = ''
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj)
  } catch (e) {
    error.value = e.message
  }
}

const escape = () => {
  if (!input.value) return
  output.value = JSON.stringify(input.value)
}

const unescape = () => {
  if (!input.value) return
  try {
    error.value = ''
    // Try to parse as a string first, then as JSON
    let val = input.value
    if (val.startsWith('"') && val.endsWith('"')) {
      val = JSON.parse(val)
    }
    const obj = JSON.parse(val)
    output.value = JSON.stringify(obj, null, 2)
  } catch (e) {
    error.value = e.message
  }
}

const clear = () => {
  input.value = ''
  output.value = ''
  error.value = ''
}

const copy = () => {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  alert(t('common.copied'))
}
</script>

<template>
  <div class="view-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="card">
      <div class="header">
        <h1>{{ t('home.tools.json.title') }}</h1>
        <div class="actions">
          <button @click="clear" class="btn-sub">{{ t('common.clear') }}</button>
        </div>
      </div>

      <div class="editor-area">
        <div class="pane">
          <div class="pane-header">
            <label>{{ t('common.input') }}</label>
            <div class="controls">
              <button @click="format">{{ t('home.tools.json.format') }}</button>
              <button @click="compress">{{ t('home.tools.json.compress') }}</button>
              <button @click="escape">{{ t('home.tools.json.escape') }}</button>
              <button @click="unescape">{{ t('home.tools.json.unescape') }}</button>
            </div>
          </div>
          <textarea v-model="input" :placeholder="t('home.tools.json.placeholder')" spellcheck="false"></textarea>
          <div v-if="error" class="error-msg">{{ error }}</div>
        </div>

        <div class="pane">
          <div class="pane-header">
            <label>{{ t('common.output') }}</label>
            <button v-if="output" @click="copy" class="btn-copy-inline">{{ t('common.copy') }}</button>
          </div>
          <textarea v-model="output" readonly spellcheck="false"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container { width: 100%; max-width: 1100px; margin: 0 auto; }
.back-nav { margin-bottom: 20px; }
.btn-back { text-decoration: none; color: #7c4dff; font-weight: bold; }

.card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.header h1 { margin: 0; font-size: 1.5rem; color: #2d3436; }

.editor-area { display: flex; gap: 20px; height: 600px; }
.pane { flex: 1; display: flex; flex-direction: column; position: relative; }
.pane-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.pane-header label { font-size: 0.8rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; }

.controls { display: flex; gap: 8px; }
.controls button { 
  background: #f1f2f6; border: 1px solid #ddd; padding: 4px 10px; 
  border-radius: 4px; font-size: 0.75rem; cursor: pointer; color: #636e72;
}
.controls button:hover { background: #7c4dff; color: white; border-color: #7c4dff; }

textarea { 
  flex: 1; border: 1px solid #eee; border-radius: 8px; padding: 15px; 
  font-family: 'Fira Code', monospace; font-size: 0.9rem; background: #fafafa; 
  resize: none; outline: none; line-height: 1.6;
}
textarea:focus { border-color: #7c4dff; background: white; }
textarea[readonly] { background: #fdfdfd; cursor: default; }

.error-msg { 
  position: absolute; bottom: 10px; left: 10px; right: 10px; 
  background: #fff1f0; color: #f5222d; padding: 8px 12px; border-radius: 4px; 
  font-size: 0.8rem; border-left: 4px solid #f5222d;
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
