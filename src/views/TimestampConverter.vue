<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const now = ref(dayjs())
let timer = null

const tsInput = ref(Math.floor(Date.now() / 1000).toString())
const dateOutput = ref('')
const unit = ref('s') // s or ms

const dateInput = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const tsOutput = ref('')

const updateNow = () => {
  now.value = dayjs()
}

const convertToDate = () => {
  if (!tsInput.value) return
  const val = parseInt(tsInput.value)
  if (isNaN(val)) {
    dateOutput.value = t('common.error')
    return
  }
  const d = unit.value === 's' ? dayjs.unix(val) : dayjs(val)
  dateOutput.value = d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : t('common.error')
}

const convertToTs = () => {
  if (!dateInput.value) return
  const d = dayjs(dateInput.value)
  if (!d.isValid()) {
    tsOutput.value = t('common.error')
    return
  }
  tsOutput.value = (unit.value === 's' ? d.unix() : d.valueOf()).toString()
}

const setNowToInput = () => {
  tsInput.value = (unit.value === 's' ? dayjs().unix() : dayjs().valueOf()).toString()
  convertToDate()
}

onMounted(() => {
  timer = setInterval(updateNow, 1000)
  convertToDate()
  convertToTs()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="tool-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="tool-card">
      <div class="tool-header">
        <h1 class="title">{{ t('home.tools.timestamp.title') }}</h1>
        <div class="current-time">
          {{ t('home.tools.timestamp.current') }}: <span class="time-val">{{ now.format('YYYY-MM-DD HH:mm:ss') }}</span>
          {{ t('home.tools.timestamp.timestamp') }}: <span class="ts-val">{{ unit === 's' ? now.unix() : now.valueOf() }}</span>
        </div>
      </div>

      <div class="converter-box">
        <div class="section">
          <h3>{{ t('home.tools.timestamp.timestamp') }} → {{ t('home.tools.timestamp.date') }}</h3>
          <div class="input-group">
            <input v-model="tsInput" @input="convertToDate" :placeholder="t('home.tools.timestamp.timestamp') + '...'" type="text">
            <select v-model="unit" @change="convertToDate">
              <option value="s">{{ t('home.tools.timestamp.seconds') }}</option>
              <option value="ms">{{ t('home.tools.timestamp.ms') }}</option>
            </select>
            <button @click="convertToDate" class="btn-action">{{ t('home.tools.timestamp.toDate') }}</button>
            <button @click="setNowToInput" class="btn-sub">{{ t('home.tools.timestamp.now') }}</button>
          </div>
          <div class="result-area">
            <label>{{ t('home.tools.timestamp.date') }}:</label>
            <input :value="dateOutput" readonly class="readonly-input">
          </div>
        </div>

        <div class="divider"></div>

        <div class="section">
          <h3>{{ t('home.tools.timestamp.date') }} → {{ t('home.tools.timestamp.timestamp') }}</h3>
          <div class="input-group">
            <input v-model="dateInput" @input="convertToTs" placeholder="YYYY-MM-DD HH:mm:ss" type="text">
            <button @click="convertToTs" class="btn-action">{{ t('home.tools.timestamp.toTimestamp') }}</button>
          </div>
          <div class="result-area">
            <label>{{ t('home.tools.timestamp.timestamp') }} ({{ unit === 's' ? t('home.tools.timestamp.seconds') : t('home.tools.timestamp.ms') }}):</label>
            <input :value="tsOutput" readonly class="readonly-input">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { width: 100%; max-width: 900px; margin: 0 auto; }
.back-nav { margin-bottom: 20px; }
.btn-back { text-decoration: none; color: #6c5ce7; font-weight: bold; }

.tool-card {
  background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px;
}

.tool-header {
  border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px;
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;
}

.title { font-size: 1.5rem; margin: 0; color: #2d3436; }
.current-time { font-size: 0.8rem; color: #636e72; }
.time-val, .ts-val { font-family: monospace; color: #6c5ce7; font-weight: bold; margin: 0 5px; }

.converter-box { display: flex; flex-direction: column; gap: 40px; }
.section h3 { font-size: 1.1rem; color: #2d3436; margin-bottom: 15px; }

.input-group { display: flex; gap: 10px; margin-bottom: 20px; }
.input-group input { flex: 1; padding: 10px 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
.input-group select { padding: 0 10px; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer; }

.btn-action { background: #6c5ce7; color: white; border: none; padding: 10px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn-sub { background: #f1f2f6; color: #2d3436; border: 1px solid #ddd; padding: 10px 15px; border-radius: 6px; cursor: pointer; }

.result-area { display: flex; align-items: center; gap: 15px; background: #fafafa; padding: 15px; border-radius: 8px; }
.result-area label { font-size: 0.9rem; color: #b2bec3; min-width: 140px; text-transform: uppercase; font-weight: bold; }
.readonly-input { flex: 1; border: none; background: transparent; font-family: 'Fira Code', monospace; font-size: 1.1rem; color: #2d3436; outline: none; font-weight: bold; }

.divider { height: 1px; background: #eee; width: 100%; }
</style>
