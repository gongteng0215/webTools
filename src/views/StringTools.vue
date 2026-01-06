<script setup>
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const inputText = ref('hello_world_variable')
const uuidCount = ref(5)
const uuidList = ref([])

const convertCase = (type) => {
  let str = inputText.value
  switch (type) {
    case 'camel':
      inputText.value = str.replace(/[-_](.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, c => c.toLowerCase())
      break
    case 'snake':
      inputText.value = str.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`).replace(/^_+/, '').replace(/[-\s]+/g, '_')
      break
    case 'pascal':
      inputText.value = str.replace(/[-_](.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, c => c.toUpperCase())
      break
    case 'kebab':
      inputText.value = str.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`).replace(/^-+/, '').replace(/[_\s]+/g, '-')
      break
    case 'upper':
      inputText.value = str.toUpperCase()
      break
    case 'lower':
      inputText.value = str.toLowerCase()
      break
  }
}

const generateUUIDs = () => {
  const arr = []
  for (let i = 0; i < uuidCount.value; i++) {
    arr.push(uuidv4())
  }
  uuidList.value = arr
}

const copyUUID = (text) => {
  navigator.clipboard.writeText(text)
  alert(t('common.copied'))
}

const copyAllUUIDs = () => {
  navigator.clipboard.writeText(uuidList.value.join('\n'))
  alert(t('common.copied'))
}
</script>

<template>
  <div class="tool-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="tool-card">
      <h1 class="title">{{ t('home.tools.strings.title') }}</h1>

      <div class="section">
        <h3>{{ t('home.tools.strings.case.title') }}</h3>
        <div class="case-box">
          <textarea v-model="inputText" :placeholder="t('common.input') + '...'" spellcheck="false"></textarea>
          <div class="buttons">
            <button @click="convertCase('camel')">{{ t('home.tools.strings.case.camel') }}</button>
            <button @click="convertCase('snake')">{{ t('home.tools.strings.case.snake') }}</button>
            <button @click="convertCase('pascal')">{{ t('home.tools.strings.case.pascal') }}</button>
            <button @click="convertCase('kebab')">{{ t('home.tools.strings.case.kebab') }}</button>
            <button @click="convertCase('upper')">{{ t('home.tools.strings.case.upper') }}</button>
            <button @click="convertCase('lower')">{{ t('home.tools.strings.case.lower') }}</button>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="section">
        <h3>{{ t('home.tools.strings.uuid.title') }}</h3>
        <div class="uuid-box">
          <div class="control">
            <label>{{ t('home.tools.strings.uuid.generate') }}:</label>
            <input type="number" v-model.number="uuidCount" min="1" max="100">
            <button @click="generateUUIDs" class="btn-action">{{ t('common.input') }}</button>
            <button @click="copyAllUUIDs" v-if="uuidList.length" class="btn-sub">{{ t('common.copy') }}</button>
          </div>
          <div class="uuid-results" v-if="uuidList.length">
            <div v-for="(id, index) in uuidList" :key="index" class="uuid-item">
              <code>{{ id }}</code>
              <button @click="copyUUID(id)">{{ t('common.copy') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { width: 100%; max-width: 900px; margin: 0 auto; }
.back-nav { margin-bottom: 20px; }
.btn-back { text-decoration: none; color: #00cec9; font-weight: bold; }

.tool-card {
  background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px;
}

.title { font-size: 1.5rem; margin: 0 0 30px; color: #2d3436; }

.section h3 { font-size: 1.1rem; color: #2d3436; margin-bottom: 20px; border-left: 4px solid #00cec9; padding-left: 10px; }

.case-box textarea { width: 100%; height: 120px; padding: 15px; border: 1px solid #eee; border-radius: 8px; font-family: 'Fira Code', monospace; font-size: 1rem; margin-bottom: 15px; resize: none; background: #fafafa; outline: none; }
.buttons { display: flex; gap: 10px; flex-wrap: wrap; }
.buttons button { background: white; border: 1px solid #ddd; padding: 8px 15px; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; color: #636e72; }
.buttons button:hover { background: #00cec9; color: white; border-color: #00cec9; }

.uuid-box .control { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
.uuid-box input { width: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
.btn-action { background: #00cec9; color: white; border: none; padding: 8px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn-sub { background: #f1f2f6; border: 1px solid #ddd; padding: 8px 15px; border-radius: 6px; cursor: pointer; }

.uuid-results { background: #f9f9f9; border-radius: 8px; padding: 10px; max-height: 400px; overflow-y: auto; border: 1px solid #eee; }
.uuid-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; border-bottom: 1px solid #eee; }
.uuid-item:last-child { border-bottom: none; }
.uuid-item code { font-family: 'Fira Code', monospace; color: #636e72; font-size: 0.9rem; }
.uuid-item button { font-size: 0.75rem; background: white; border: 1px solid #ddd; padding: 4px 10px; border-radius: 4px; cursor: pointer; color: #636e72; }
.uuid-item button:hover { border-color: #00cec9; color: #00cec9; }

.divider { height: 1px; background: #eee; width: 100%; margin: 35px 0; }
</style>
