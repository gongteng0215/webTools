<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast } from '../utils/toast'

const { t } = useI18n()

const hex = ref('#6c5ce7')
const rgb = ref('108, 92, 231')
const hsl = ref('247, 74%, 63%')

const updateFromHex = () => {
  let h = hex.value.replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c+c).join('')
  if (h.length !== 6) return

  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  rgb.value = `${r}, ${g}, ${b}`
  
  convertToHSL(r, g, b)
}

const convertToHSL = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  hsl.value = `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
  showToast(`${t('common.copied')}: ${text}`)
}

const commonColors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3',
  '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39',
  '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e',
  '#607d8b', '#2d3436', '#6c5ce7', '#00b894', '#0984e3', '#fd79a8'
]

const shades = ref([])

const generateShades = () => {
  const arr = []
  let h = hex.value.replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c+c).join('')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)

  for (let i = 1; i <= 10; i++) {
    const factor = i / 10
    const rs = Math.round(r + (255 - r) * (1 - factor))
    const gs = Math.round(g + (255 - g) * (1 - factor))
    const bs = Math.round(b + (255 - b) * (1 - factor))
    arr.push(`#${((1 << 24) + (rs << 16) + (gs << 8) + bs).toString(16).slice(1)}`)
  }
  shades.value = arr
}

const setHex = (color) => {
  hex.value = color
}

watch(hex, () => {
  updateFromHex()
  generateShades()
}, { immediate: true })
</script>

<template>
  <div class="tool-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="tool-card">
      <h1 class="title">{{ t('home.tools.colors.title') }}</h1>

      <div class="color-layout">
        <div class="col col-preview">
          <div class="color-preview" :style="{ backgroundColor: hex }">
            <span class="preview-text" :style="{ color: parseFloat(hsl.split(',')[2]) > 50 ? '#000' : '#fff' }">{{ hex }}</span>
          </div>
          
          <div class="palette-grid">
            <label>{{ t('home.tools.colors.presets') }}</label>
            <div class="grid">
              <div v-for="c in commonColors" :key="c" 
                   class="grid-item" 
                   :style="{ backgroundColor: c }"
                   @click="setHex(c)"
                   :class="{ active: hex.toLowerCase() === c.toLowerCase() }">
              </div>
            </div>
          </div>

          <div class="picker-section">
            <label>{{ t('home.tools.colors.picker') }}</label>
            <div class="picker-wrapper">
              <input type="color" v-model="hex" class="native-picker">
              <span>{{ t('home.tools.colors.format') }}</span>
            </div>
          </div>
        </div>

        <div class="col col-details">
          <div class="inputs-section">
            <div class="input-item">
              <label>HEX</label>
              <div class="input-group">
                <input v-model="hex" placeholder="#000000" spellcheck="false">
                <button @click="copyToClipboard(hex)">{{ t('common.copy') }}</button>
              </div>
            </div>

            <div class="input-item">
              <label>RGB</label>
              <div class="input-group">
                <input v-model="rgb" readonly>
                <button @click="copyToClipboard(`rgb(${rgb})`)">{{ t('common.copy') }}</button>
              </div>
            </div>

            <div class="input-item">
              <label>HSL</label>
              <div class="input-group">
                <input v-model="hsl" readonly>
                <button @click="copyToClipboard(`hsl(${hsl})`)">{{ t('common.copy') }}</button>
              </div>
            </div>
          </div>

          <div class="shades-section">
            <label>{{ t('home.tools.colors.shades') }}</label>
            <div class="shades-list">
              <div v-for="s in shades" :key="s" 
                   class="shade-item" 
                   :style="{ backgroundColor: s }"
                   @click="setHex(s)"
                   :title="s">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { width: 100%; max-width: 1000px; margin: 0 auto; }
.back-nav { margin-bottom: 20px; }
.btn-back { text-decoration: none; color: var(--primary); font-weight: bold; }

.tool-card {
  background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px;
}

.title { font-size: 1.5rem; margin: 0 0 30px; color: #2d3436; }

.color-layout { display: flex; gap: 40px; }
.col { flex: 1; display: flex; flex-direction: column; gap: 25px; }

.color-preview { 
  width: 100%; height: 120px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
  transition: background 0.3s; box-shadow: inset 0 0 15px rgba(0,0,0,0.1);
}
.preview-text { font-family: 'Fira Code', monospace; font-weight: bold; font-size: 1.2rem; filter: drop-shadow(0 0 2px rgba(0,0,0,0.2)); }

.palette-grid label, .picker-section label, .input-item label, .shades-section label {
  display: block; font-size: 0.75rem; color: #b2bec3; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;
}

.grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
.grid-item { 
  aspect-ratio: 1; border-radius: 6px; cursor: pointer; border: 2px solid transparent;
  transition: transform 0.2s, border-color 0.2s;
}
.grid-item:hover { transform: scale(1.15); z-index: 1; }
.grid-item.active { border-color: #2d3436; box-shadow: 0 0 10px rgba(0,0,0,0.2); }

.picker-wrapper { 
  background: #f8f9fa; padding: 10px; border-radius: 8px; display: flex; align-items: center; gap: 12px; border: 1px dashed #ddd; cursor: pointer;
}
.native-picker { width: 40px; height: 30px; border: none; background: none; cursor: pointer; }
.picker-wrapper span { font-size: 0.85rem; color: #636e72; }

.inputs-section { display: flex; flex-direction: column; gap: 15px; }
.input-group { display: flex; gap: 10px; }
.input-group input { flex: 1; padding: 10px 12px; border: 1px solid #eee; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 0.95rem; background: #fafafa; outline: none; }
.input-group button { background: var(--primary-soft); border: 1px solid var(--primary-border); padding: 0 15px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; color: var(--primary); }
.input-group button:hover { background: var(--primary); color: white; }

.shades-list { display: flex; height: 40px; border-radius: 6px; overflow: hidden; border: 1px solid #eee; }
.shade-item { flex: 1; cursor: pointer; transition: flex-grow 0.2s; }
.shade-item:hover { flex-grow: 1.5; }

@media (max-width: 800px) {
  .color-layout { flex-direction: column; }
}
</style>
