<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeTab = ref('storage') // storage, screen

// Storage Logic
const storageUnits = [
  { label: 'Byte (B)', value: 1 },
  { label: 'KB', value: 1024 },
  { label: 'MB', value: 1024 ** 2 },
  { label: 'GB', value: 1024 ** 3 },
  { label: 'TB', value: 1024 ** 4 }
]
const storageVals = reactive({
  B: 1048576,
  KB: 1024,
  MB: 1,
  GB: 0.0009765625,
  TB: 0.00000095367431640625
})

const updateStorage = (key) => {
  const currentUnitValue = storageUnits.find(u => u.label.startsWith(key)).value
  const byteValue = storageVals[key] * currentUnitValue
  
  storageUnits.forEach(u => {
    const k = u.label.split(' ')[0]
    if (k !== key) {
      storageVals[k] = parseFloat((byteValue / u.value).toFixed(8))
    }
  })
}

// Screen Logic
const screenParams = reactive({
  pixel: 160,
  rem: 10,
  rootSize: 16
})

const updateFromPixel = () => {
  screenParams.rem = parseFloat((screenParams.pixel / screenParams.rootSize).toFixed(4))
}
const updateFromRem = () => {
  screenParams.pixel = parseFloat((screenParams.rem * screenParams.rootSize).toFixed(2))
}
</script>

<template>
  <div class="tool-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="tool-card">
      <h1 class="title">{{ t('home.tools.unit.title') }}</h1>

      <div class="tabs">
        <button @click="activeTab = 'storage'" :class="{ active: activeTab === 'storage' }">{{ t('home.tools.unit.storage') }}</button>
        <button @click="activeTab = 'screen'" :class="{ active: activeTab === 'screen' }">{{ t('home.tools.unit.css') }}</button>
      </div>

      <div v-if="activeTab === 'storage'" class="content-box">
        <div v-for="u in storageUnits" :key="u.label" class="converter-item">
          <label>{{ u.label }}</label>
          <input type="number" 
                 v-model="storageVals[u.label.split(' ')[0]]" 
                 @input="updateStorage(u.label.split(' ')[0])">
        </div>
      </div>

      <div v-else class="content-box screen-converter">
        <div class="root-setup">
          <label>{{ t('home.tools.unit.basePx') }}:</label>
          <input type="number" v-model.number="screenParams.rootSize" @input="updateFromPixel">
          <p class="hint">{{ t('home.tools.unit.hint') }}</p>
        </div>
        
        <div class="divider"></div>

        <div class="dual-input">
          <div class="converter-item">
            <label>Pixel (px)</label>
            <input type="number" v-model.number="screenParams.pixel" @input="updateFromPixel">
          </div>
          <div class="swap-icon">⇌</div>
          <div class="converter-item">
            <label>REM (rem)</label>
            <input type="number" v-model.number="screenParams.rem" @input="updateFromRem">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { width: 100%; max-width: 800px; margin: 0 auto; }
.btn-back { text-decoration: none; color: var(--primary); font-weight: bold; margin-bottom: 20px; display: inline-block; }

.tool-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; }
.title { font-size: 1.5rem; margin: 0 0 30px; color: #2d3436; }

.tabs { display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 1px solid #eee; }
.tabs button { padding: 10px 20px; border: none; background: none; cursor: pointer; color: var(--text-muted); font-weight: bold; border-bottom: 3px solid transparent; }
.tabs button.active { color: var(--primary); border-bottom-color: var(--primary); }

.content-box { display: flex; flex-direction: column; gap: 15px; }

.converter-item { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.converter-item label { font-size: 0.75rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; }
.converter-item input { padding: 12px 15px; border: 1px solid #eee; border-radius: 8px; font-size: 1.1rem; font-family: 'Fira Code', monospace; outline: none; background: #fafafa; transition: border-color 0.2s; }
.converter-item input:focus { border-color: var(--primary); background: white; }

.screen-converter .root-setup { display: flex; align-items: center; gap: 15px; background: #fdfdfd; padding: 15px; border-radius: 10px; border: 1px dashed #ddd; }
.root-setup input { width: 80px; padding: 8px 12px; border: 1px solid #eee; border-radius: 6px; }
.hint { font-size: 0.8rem; color: #b2bec3; margin: 0; }

.divider { height: 1px; background: #eee; margin: 15px 0; }

.dual-input { display: flex; align-items: flex-end; gap: 20px; }
.swap-icon { font-size: 1.5rem; color: #dcdde1; padding-bottom: 15px; }

@media (max-width: 600px) {
  .dual-input { flex-direction: column; align-items: stretch; }
  .swap-icon { display: none; }
}
</style>
