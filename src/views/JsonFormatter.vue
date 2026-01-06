<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Papa from 'papaparse'

const { t } = useI18n()

// State
const input = ref('{"project":"WebTools","version":1.0,"features":["JSON","CSV","Cron"],"active":true}')
const output = ref('')
const error = ref('')
const sourceFormat = ref('text')
const targetFormat = ref('json')
const isCompressed = ref(false)

// Logic Matrix
const convert = () => {
  if (!input.value || !input.value.trim()) {
    output.value = ''
    error.value = ''
    return
  }

  try {
    error.value = ''
    const src = sourceFormat.value
    const tgt = targetFormat.value
    
    // ----------------------------------------------------------------
    // 1. JSON Source
    // ----------------------------------------------------------------
    if (src === 'json') {
      // JSON -> JSON
      if (tgt === 'json') {
        const obj = JSON.parse(input.value)
        output.value = isCompressed.value 
          ? JSON.stringify(obj)
          : JSON.stringify(obj, null, 2)
      }
      // JSON -> CSV
      else if (tgt === 'csv') {
        const obj = JSON.parse(input.value)
        const jsonArray = Array.isArray(obj) ? obj : [obj]
        output.value = Papa.unparse(jsonArray)
      }
      // JSON -> Escaped String
      else if (tgt === 'escaped') {
         // Treat input as raw, or ensure valid JSON first?
         // Usually Escape means "Raw Text -> JSON String". 
         // If source is JSON, we might want to stringify it first then escape?
         // Let's assume standard behavior: Input is CONTENT. Output is stringified version.
         // Actually, if Src=JSON, Tgt=Escaped, it means "Stringify and Escape"?
         // Let's stick to the previous simple logic: Escape = JSON.stringify(text)
         // But here source implies validation.
         // Let's just validate it's JSON, then stringify valid JSON.
         const obj = JSON.parse(input.value)
         const str = JSON.stringify(obj) // Minified JSON string
         output.value = JSON.stringify(str) // Escaped twice? No.
         // Escape tool usually takes raw text. 
         // If I select JSON source, I expect it to be valid JSON.
         // If I select Text source, I expect any text. 
         // Let's fallback to Text behavior for Escape if target is escaped.
         output.value = JSON.stringify(input.value)
      }
      // JSON -> Text (Just raw code?)
      else if (tgt === 'text') {
         output.value = input.value
      }
    }

    // ----------------------------------------------------------------
    // 2. CSV Source
    // ----------------------------------------------------------------
    else if (src === 'csv') {
       // CSV -> JSON
       if (tgt === 'json') {
          const result = Papa.parse(input.value, { header: true, skipEmptyLines: true })
          if (result.errors.length) throw new Error(result.errors[0].message)
          
          output.value = isCompressed.value 
            ? JSON.stringify(result.data)
            : JSON.stringify(result.data, null, 2)
       }
       // CSV -> CSV (Format/Clean?)
       else if (tgt === 'csv') {
          const result = Papa.parse(input.value, { header: true, skipEmptyLines: true })
          output.value = Papa.unparse(result.data)
       }
       // Fallback
       else {
          output.value = input.value
       }
    }

    // ----------------------------------------------------------------
    // 3. Text Source
    // ----------------------------------------------------------------
    else if (src === 'text') {
      // Text -> Escaped
      if (tgt === 'escaped') {
        output.value = JSON.stringify(input.value)
      }
      // Text -> JSON (Try to parse?)
      else if (tgt === 'json') {
         const obj = JSON.parse(input.value)
         output.value = isCompressed.value 
           ? JSON.stringify(obj)
           : JSON.stringify(obj, null, 2)
      }
      else {
        output.value = input.value
      }
    }

    // ----------------------------------------------------------------
    // 4. Escaped Source
    // ----------------------------------------------------------------
    else if (src === 'escaped') {
       // Escaped -> Text (Unescape)
       // Logic: JSON.parse(val) if string
       let val = input.value.trim()
       // Relaxed unescape: if wrapped in quotes, parse it
       if (val.startsWith('"') && val.endsWith('"')) {
          output.value = JSON.parse(val)
       } else {
          // If not wrapped, maybe just return as is or error?
          // Let's try to parse anyway
          output.value = JSON.parse(val)
       }
       
       // If target is JSON, try to format the result?
       if (tgt === 'json') {
          const obj = JSON.parse(output.value)
          output.value = isCompressed.value 
            ? JSON.stringify(obj)
            : JSON.stringify(obj, null, 2)
       }
    }

  } catch (e) {
    output.value = '' // Clear output on error to avoid confusion
    error.value = e.message
  }
}

const swap = () => {
  const tempFmt = sourceFormat.value
  sourceFormat.value = targetFormat.value
  targetFormat.value = tempFmt

  if (output.value && !error.value) {
    input.value = output.value
  }
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

watch([input, sourceFormat, targetFormat, isCompressed], convert)
onMounted(convert)
</script>

<template>
  <div class="tool-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="tool-card">
      <div class="tool-header">
        <h1 class="title">{{ t('home.tools.json.title') }}</h1>
        <div class="actions">
          <button @click="clearInput" class="btn-sub">{{ t('common.clear') }}</button>
        </div>
      </div>

      <div class="converter-bar">
        <div class="select-wrapper">
          <label>{{ t('home.tools.json.source') }}</label>
          <div class="select-box">
             <select v-model="sourceFormat">
              <option value="json">{{ t('home.tools.json.formats.json') }}</option>
              <option value="csv">{{ t('home.tools.json.formats.csv') }}</option>
              <option value="text">{{ t('home.tools.json.formats.text') }}</option>
              <option value="escaped">{{ t('home.tools.json.formats.escaped') }}</option>
            </select>
          </div>
        </div>
        
        <button @click="swap" class="btn-swap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
          </svg>
        </button>

        <div class="select-wrapper">
          <label>{{ t('home.tools.json.target') }}</label>
           <div class="select-box">
            <select v-model="targetFormat">
              <option value="json">{{ t('home.tools.json.formats.json') }}</option>
              <option value="csv">{{ t('home.tools.json.formats.csv') }}</option>
              <option value="text">{{ t('home.tools.json.formats.text') }}</option>
              <option value="escaped">{{ t('home.tools.json.formats.escaped') }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="editor-area">
        <div class="pane">
          <div class="pane-header">
            <label>{{ t('common.input') }} ({{ sourceFormat.toUpperCase() }})</label>
          </div>
          <textarea v-model="input" :placeholder="t('home.tools.json.placeholder')"></textarea>
          <div v-if="error" class="error-msg">{{ error }}</div>
        </div>

        <div class="pane">
          <div class="pane-header">
             <div class="header-left">
                <label>{{ t('common.output') }} ({{ targetFormat.toUpperCase() }})</label>
                <div v-if="targetFormat === 'json'" class="compress-opt">
                    <input type="checkbox" id="compress" v-model="isCompressed">
                    <label for="compress">{{ t('home.tools.json.compress') }}</label>
                </div>
             </div>
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
.btn-back { text-decoration: none; color: #7c4dff; font-weight: bold; margin-bottom: 20px; display: inline-block; }

.tool-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; }

.tool-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.title { font-size: 1.5rem; margin: 0; color: #2d3436; }

/* Converter Bar Styling (Matched ConfigConverter) */
.converter-bar { 
  display: flex; align-items: center; justify-content: center; gap: 20px; 
  margin-bottom: 30px; padding: 15px; background: #fff;
  border: 1px solid #f1f2f6; border-radius: 50px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  max-width: 700px; margin-left: auto; margin-right: auto;
}

.select-wrapper { display: flex; align-items: center; gap: 10px; }
.select-wrapper label { font-size: 0.9rem; color: #636e72; font-weight: 700; white-space: nowrap; }

.select-box { position: relative; }
.select-box select { 
  appearance: none; -webkit-appearance: none;
  padding: 8px 35px 8px 15px; 
  border: 1px solid #dfe6e9; border-radius: 20px; 
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23636e72' d='M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.762L10.825 4z'/%3E%3C/svg%3E") no-repeat right 10px center;
  font-size: 0.9rem; color: #2d3436; font-weight: 600; cursor: pointer; outline: none;
  min-width: 140px; transition: all 0.2s;
}
.select-box select:hover { border-color: #7c4dff; }
.select-box select:focus { border-color: #7c4dff; box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.1); }

.btn-swap { 
  width: 40px; height: 40px; border-radius: 50%; border: 1px solid #dfe6e9;
  background: white; color: #7c4dff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.btn-swap:hover { 
  background: #7c4dff; color: white; border-color: #7c4dff;
  transform: rotate(180deg); 
}
.btn-swap svg { width: 20px; height: 20px; }

.editor-area { display: flex; gap: 20px; height: 600px; }
.pane { flex: 1; display: flex; flex-direction: column; position: relative; }
.pane-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.pane-header label { font-size: 0.8rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; }

.header-left { display: flex; align-items: center; gap: 15px; }
.compress-opt { display: flex; align-items: center; gap: 5px; }
.compress-opt input { cursor: pointer; accent-color: #7c4dff; }
.compress-opt label { text-transform: none; color: #2d3436; cursor: pointer; font-size: 0.8rem; }

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
