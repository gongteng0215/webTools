<script setup>
import { ref, watch, onMounted } from 'vue'
import cronstrue from 'cronstrue/i18n'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const cronInput = ref('5 4 * * *')
const humanReadable = ref('')
const nextExecution = ref('')
const upcomingList = ref([]) // For the next 7 runs
const error = ref('')

let debounceTimer = null

const parseCron = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => executeParse(), 100)
}

// ---------------------------------------------------------
// Custom Lightweight Cron Parser Implementation
// Replaces broken cron-parser dependency
// ---------------------------------------------------------
const parseField = (field, min, max) => {
  const result = new Set()
  const parts = field.split(',')
  
  for (const part of parts) {
    if (part === '*') {
      for (let i = min; i <= max; i++) result.add(i)
    } else if (part.includes('/')) {
      const [base, stepStr] = part.split('/')
      const step = parseInt(stepStr, 10)
      const start = base === '*' ? min : parseInt(base, 10)
      for (let i = start; i <= max; i += step) result.add(i)
    } else if (part.includes('-')) {
      const [startStr, endStr] = part.split('-')
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)
      for (let i = start; i <= end; i++) result.add(i)
    } else {
      result.add(parseInt(part, 10))
    }
  }
  return Array.from(result).sort((a, b) => a - b)
}

// Helper to get next execution time AFTER a specific date
const getNextCronTime = (expression, fromDate = new Date()) => {
  const parts = expression.trim().split(/\s+/)
  if (parts.length < 5) throw new Error('Invalid cron expression (too few fields)')

  const minutes = parseField(parts[0], 0, 59)
  const hours = parseField(parts[1], 0, 23)
  const days = parseField(parts[2], 1, 31)
  const months = parseField(parts[3], 1, 12)
  const dows = parseField(parts[4], 0, 6) // 0=Sun

  // Start searching from the beginning of the NEXT minute to ensure strictly increasing times
  let current = new Date(fromDate.getTime())
  current.setSeconds(0)
  current.setMilliseconds(0)
  current.setMinutes(current.getMinutes() + 1)

  // Safety break
  let loops = 0
  
  while (loops < 10000) {
    const currentMonth = current.getMonth() + 1
    if (!months.includes(currentMonth)) {
      current.setMonth(current.getMonth() + 1)
      current.setDate(1)
      current.setHours(0, 0, 0, 0)
      continue
    }

    const currentDay = current.getDate()
    if (!days.includes(currentDay)) {
      current.setDate(current.getDate() + 1)
      current.setHours(0, 0, 0, 0)
      continue
    }

    const currentDow = current.getDay()
    if (!dows.includes(currentDow)) {
      current.setDate(current.getDate() + 1)
      current.setHours(0, 0, 0, 0)
      continue
    }

    const currentHour = current.getHours()
    if (!hours.includes(currentHour)) {
      current.setHours(current.getHours() + 1)
      current.setMinutes(0)
      continue
    }

    const currentMinute = current.getMinutes()
    if (minutes.includes(currentMinute)) {
      return current // Found match
    } else {
      const nextMin = minutes.find(m => m > currentMinute)
      if (nextMin !== undefined) {
        current.setMinutes(nextMin)
        return current
      } else {
        current.setHours(current.getHours() + 1)
        current.setMinutes(0)
      }
    }
    loops++
  }
  throw new Error('No execution time found in near future')
}
// ---------------------------------------------------------

const executeParse = () => {
  const cronStr = cronInput.value?.trim()
  if (!cronStr) {
    humanReadable.value = ''
    nextExecution.value = ''
    upcomingList.value = []
    error.value = ''
    return
  }

  // 1. Human Readable Description
  try {
    const ct = cronstrue.default || cronstrue
    const ctLib = ct.toString ? ct : (ct.default || ct)
    humanReadable.value = ctLib.toString(cronStr, { 
      locale: locale.value === 'zh' ? 'zh_CN' : 'en',
      use24HourTimeFormat: true
    })
  } catch (e) {
    humanReadable.value = t('home.tools.cron.invalid')
  }

  // 2. Next Executions Prediction (List of 7)
  try {
    error.value = ''
    const list = []
    let lastDate = new Date()
    
    // Get next 7
    for (let i = 0; i < 7; i++) {
        const next = getNextCronTime(cronStr, lastDate)
        list.push(dayjs(next).format('YYYY-MM-DD HH:mm:ss'))
        lastDate = next
    }
    
    if (list.length > 0) {
        nextExecution.value = list[0] // Primary display
        upcomingList.value = list     // Full list
    }

  } catch (err) {
    nextExecution.value = ''
    upcomingList.value = []
    error.value = err.message
    console.warn('[CronDebug] Parser Error:', err)
  }
}

const generateRandom = () => {
  const randomPart = (min, max) => {
    if (Math.random() > 0.7) return '*'
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  cronInput.value = `${randomPart(0, 59)} ${randomPart(0, 23)} ${randomPart(1, 31)} ${randomPart(1, 12)} ${randomPart(0, 6)}`
  executeParse()
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(cronInput.value)
}

watch([cronInput, locale], parseCron)
onMounted(executeParse)
</script>

<template>
  <div class="cron-guru-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="content">
      <header class="guru-header">
        <h1 class="logo-text">{{ t('home.tools.cron.title') }}</h1>
        <p class="subtitle">{{ t('home.tools.cron.desc') }}</p>
      </header>

      <section class="display-section">
        <h2 class="human-text">“{{ humanReadable || '...' }}”</h2>
        <p class="next-text" v-if="nextExecution">
          <span class="next-label">{{ t('home.tools.cron.next') }}</span> {{ t('common.at') || 'at' }} {{ nextExecution }}
        </p>
        <p class="error-text" v-if="error && cronInput">{{ error }}</p>
      </section>

      <div class="input-container">
        <div class="random-tab" @click="generateRandom">{{ t('home.tools.cron.randomBtn') }}</div> 
        <div class="input-box">
          <input 
            v-model="cronInput" 
            class="cron-input" 
            spellcheck="false"
            autofocus
            @input="parseCron"
          />
          <button class="btn-copy" @click="copyToClipboard">{{ t('common.copy') }}</button>
        </div>
      </div>

      <div class="labels-grid">
        <div class="label-item">{{ t('home.tools.cron.fields.minute') }}</div>
        <div class="label-item">{{ t('home.tools.cron.fields.hour') }}</div>
        <div class="label-item">{{ t('home.tools.cron.fields.day') }}</div>
        <div class="label-item">{{ t('home.tools.cron.fields.month') }}</div>
        <div class="label-item">{{ t('home.tools.cron.fields.weekday') }}</div>
      </div>

      <table class="syntax-table">
        <tbody>
          <tr>
            <td class="symbol">*</td>
            <td class="meaning">{{ t('home.tools.cron.syntax.any') }}</td>
          </tr>
          <tr>
            <td class="symbol">,</td>
            <td class="meaning">{{ t('home.tools.cron.syntax.list') }}</td>
          </tr>
          <tr>
            <td class="symbol">-</td>
            <td class="meaning">{{ t('home.tools.cron.syntax.range') }}</td>
          </tr>
          <tr>
            <td class="symbol">/</td>
            <td class="meaning">{{ t('home.tools.cron.syntax.step') }}</td>
          </tr>
        </tbody>
      </table>

      <!-- New Upcoming List Section -->
      <div class="upcoming-section" v-if="upcomingList.length > 0">
        <h3 class="upcoming-title">{{ t('home.tools.cron.upcomingRuns') }}</h3>
        <ul class="upcoming-list">
            <li v-for="(time, index) in upcomingList" :key="index">
                {{ time }}
            </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');

.cron-guru-container {
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #fff;
  font-family: 'Open Sans', sans-serif;
  padding: 40px 20px;
}

.back-nav {
  max-width: 800px;
  margin: 0 auto 40px;
}
.btn-back {
  color: #777;
  text-decoration: none;
  font-size: 0.9rem;
}
.btn-back:hover {
  color: #aaa;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.guru-header {
  margin-bottom: 60px;
}
.logo-text {
  font-size: 4rem;
  font-weight: 700;
  color: #ffff88;
  margin: 0;
  letter-spacing: -2px;
  text-shadow: 0 0 10px rgba(255, 255, 136, 0.3);
}
.subtitle {
  color: #999;
  font-size: 1.1rem;
  margin-top: 10px;
}

.display-section {
  margin-bottom: 40px;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.human-text {
  font-size: 3rem;
  font-weight: 400;
  margin: 0 0 15px;
  color: #fff;
  line-height: 1.2;
}
.next-text {
  color: #777;
  font-size: 1rem;
  font-family: monospace;
}
.next-label {
  text-decoration: underline;
  cursor: pointer;
}
.error-text {
  color: #ff7675;
  font-size: 0.9rem;
  margin-top: 10px;
  font-family: monospace;
}

.input-container {
  position: relative;
  max-width: 700px;
  margin: 0 auto 10px;
}
.random-tab {
  position: absolute;
  right: 20px;
  top: -30px;
  background: #ffffbb;
  color: #222;
  padding: 5px 15px;
  font-size: 0.9rem;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-weight: 700;
}
.input-box {
  background: #111;
  border: 4px solid #ffffbb;
  border-radius: 12px;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 30px rgba(255, 255, 187, 0.15);
}
.cron-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 3.5rem;
  font-family: monospace;
  text-align: center;
  outline: none;
  letter-spacing: 5px;
}
.btn-copy {
  background: #ffffbb;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  color: #111;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-copy:hover {
  background: #fff;
}

.labels-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  max-width: 600px;
  margin: 0 auto 80px;
  color: #777;
  font-size: 1.1rem;
}
.label-item {
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
}
.label-item:hover {
  color: #ffff88;
}

.syntax-table {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  border-collapse: collapse;
  color: #666;
  font-family: monospace;
}
.syntax-table td {
  padding: 10px 20px;
  border-top: 1px solid #333;
}
.symbol {
  text-align: right;
  font-weight: 700;
  font-size: 1.3rem;
  width: 40%;
  color: #888;
}
.meaning {
  text-align: left;
  font-size: 1rem;
}

.upcoming-section {
    margin-top: 60px;
    padding-top: 40px;
    border-top: 1px solid #333;
    text-align: left;
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
}
.upcoming-title {
    color: #ffff88;
    font-size: 1.1rem;
    margin-bottom: 20px;
    text-align: center;
}
.upcoming-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-family: monospace;
    color: #aaa;
    text-align: center;
}
.upcoming-list li {
    padding: 6px 0;
    border-bottom: 1px solid #222;
}
.upcoming-list li:last-child {
    border-bottom: none;
}

@media (max-width: 600px) {
  .logo-text { font-size: 2.5rem; letter-spacing: 0; }
  .human-text { font-size: 1.8rem; }
  .cron-input { font-size: 1.8rem; }
  .labels-grid { font-size: 0.8rem; }
}
</style>
