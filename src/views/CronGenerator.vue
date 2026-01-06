<script setup>
import { ref, watch, onMounted } from 'vue'
import cronstrue from 'cronstrue/i18n'
import * as cronParserMod from 'cron-parser'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const cronInput = ref('*/5 * * * *')
const humanReadable = ref('')
const nextExecutions = ref([])
const error = ref('')

// Brute-force find parseExpression which is sometimes wrapped differently in Vite/UMD
const getParser = () => {
  const mod = cronParserMod.default || cronParserMod
  if (typeof mod.parseExpression === 'function') return mod.parseExpression
  if (typeof mod === 'function') return mod
  return null
}

const parseCron = () => {
  if (!cronInput.value || !cronInput.value.trim()) {
    humanReadable.value = ''
    nextExecutions.value = []
    error.value = ''
    return
  }

  // Split into parts to check count
  const parts = cronInput.value.trim().split(/\s+/)
  if (parts.length > 5) {
    cronInput.value = parts.slice(0, 5).join(' ')
    return
  }

  try {
    error.value = ''
    // 1. Human readable
    humanReadable.value = cronstrue.toString(cronInput.value, { locale: locale.value === 'zh' ? 'zh_CN' : 'en' })

    // 2. Next executions
    const parse = getParser()
    if (parse) {
      const interval = parse(cronInput.value)
      const nexts = []
      // Get next 7 occurrences
      for (let i = 0; i < 7; i++) {
        try {
          const next = interval.next()
          // cron-parser might return an object with toDate() or just a date-like object
          const date = typeof next.toDate === 'function' ? next.toDate() : new Date(next.toString())
          nexts.push(formatCronDate(date))
        } catch (e) { break }
      }
      nextExecutions.value = nexts
    }
  } catch (err) {
    humanReadable.value = t('home.tools.cron.invalid')
    nextExecutions.value = []
    error.value = err.message
  }
}

const formatCronDate = (date) => {
  const opt = { 
    year: 'numeric', month: '2-digit', day: '2-digit', 
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false 
  }
  return new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-CN' : 'en-US', opt).format(date).replace(/\//g, '-')
}

const generateRandom = () => {
  const randomPart = (min, max) => {
    if (Math.random() > 0.7) return '*'
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  cronInput.value = `${randomPart(0, 59)} ${randomPart(0, 23)} ${randomPart(1, 31)} ${randomPart(1, 12)} ${randomPart(0, 6)}`
}

watch([cronInput, locale], parseCron)
onMounted(parseCron)
</script>

<template>
  <div class="view-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="cron-card">
      <div class="header">
        <h1>{{ t('home.tools.cron.title') }}</h1>
        <button class="btn-random" @click="generateRandom">{{ t('home.tools.cron.randomBtn') }}</button>
      </div>

      <div class="input-section">
        <label>{{ t('home.tools.cron.inputLabel') }}</label>
        <div class="input-wrapper">
          <input v-model="cronInput" :placeholder="t('home.tools.cron.placeholder')" spellcheck="false" />
        </div>
      </div>

      <div class="result-section">
        <div class="desc-box">
          <div class="label">{{ t('home.tools.cron.humanDescription') }}</div>
          <div class="value">{{ humanReadable }}</div>
        </div>

        <div class="next-box">
          <div class="label">{{ t('home.tools.cron.nextExecution') }}</div>
          <div class="value highlight" v-if="nextExecutions.length > 0">{{ nextExecutions[0] }}</div>
          <div class="value" v-else>-</div>
        </div>
      </div>

      <div class="upcoming-section" v-if="nextExecutions.length > 0">
        <h3>{{ t('home.tools.cron.upcomingRuns') }}</h3>
        <div class="runs-list">
          <div v-for="(run, idx) in nextExecutions.slice(1)" :key="idx" class="run-item">
            <span class="dot"></span>
            {{ run }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container { width: 100%; max-width: 900px; }
.back-nav { margin-bottom: 20px; }
.btn-back { text-decoration: none; color: #7c4dff; font-weight: bold; }

.cron-card {
  background: white; border-radius: 12px; padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.header h1 { margin: 0; font-size: 1.8rem; color: #2d3436; }

.btn-random {
  background: #f1f2f6; border: 1px solid #ddd; padding: 6px 15px;
  border-radius: 6px; cursor: pointer; color: #636e72; font-weight: bold;
}

.input-section { margin-bottom: 30px; }
.input-section label { display: block; margin-bottom: 10px; font-weight: bold; color: #636e72; }
.input-wrapper { 
  background: #2d3436; border-radius: 8px; padding: 15px;
  border: 4px solid #f1fa8c; 
}
.input-wrapper input {
  width: 100%; background: transparent; border: none; color: #f1fa8c;
  font-family: 'Fira Code', monospace; font-size: 2rem; text-align: center; outline: none;
}

.result-section { display: flex; gap: 20px; margin-bottom: 30px; }
.desc-box, .next-box { 
  flex: 1; background: #f8f9fa; padding: 20px; border-radius: 10px;
  border: 1px solid #eee;
}
.label { font-size: 0.8rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; }
.value { font-size: 1.2rem; font-weight: bold; color: #2d3436; }
.highlight { color: #05c46b; }

.upcoming-section h3 { font-size: 0.9rem; color: #b2bec3; margin-bottom: 15px; }
.runs-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.run-item { 
  display: flex; align-items: center; gap: 10px; padding: 10px;
  background: #fafafa; border-radius: 6px; font-family: monospace; color: #636e72;
}
.dot { width: 6px; height: 6px; background: #05c46b; border-radius: 50%; }
</style>
