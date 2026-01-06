<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const options = ref({
  lowercase: true,
  uppercase: true,
  numbers: true,
  special: true,
  specialChars: '!@#$%^&*',
  excludeSimilar: false
})

const passwordLength = ref(16)
const quantity = ref(10)
const passwords = ref([])

const generatePasswords = () => {
  const result = []
  let pool = ''
  if (options.value.lowercase) pool += 'abcdefghijklmnopqrstuvwxyz'
  if (options.value.uppercase) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (options.value.numbers) pool += '0123456789'
  if (options.value.special) pool += options.value.specialChars

  if (pool === '') {
    alert(t('home.tools.password.alertCharType'))
    return
  }

  for (let i = 0; i < quantity.value; i++) {
    let password = ''
    for (let j = 0; j < passwordLength.value; j++) {
      password += pool.charAt(Math.floor(Math.random() * pool.length))
    }
    result.push({
      id: i + 1,
      value: password,
      strength: getStrengthLabel(password)
    })
  }
  passwords.value = result
}

const getStrengthLabel = (pass) => {
  if (pass.length >= 32) return 'ultra'
  if (pass.length >= 16) return 'high'
  if (pass.length >= 10) return 'med'
  return 'low'
}

const getStrengthClass = (strength) => {
  if (strength === 'ultra' || strength === 'high') return 'strength-high'
  if (strength === 'med') return 'strength-med'
  return 'strength-low'
}

const copiedId = ref(null)

const copyToClipboard = (text, id) => {
  navigator.clipboard.writeText(text).then(() => {
    copiedId.value = id
    setTimeout(() => {
      if (copiedId.value === id) copiedId.value = null
    }, 2000)
  })
}
</script>

<template>
  <div class="view-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>
    
    <div class="card">
      <h1>{{ t('home.tools.password.title') }}</h1>

      <div class="control-group">
        <div class="label-side">{{ t('home.tools.password.options') }}</div>
        <div class="content-side">
          <label><input type="checkbox" v-model="options.lowercase"> {{ t('home.tools.password.lowercase') }}</label>
          <label><input type="checkbox" v-model="options.uppercase"> {{ t('home.tools.password.uppercase') }}</label>
          <label><input type="checkbox" v-model="options.numbers"> {{ t('home.tools.password.numbers') }}</label>
        </div>
      </div>

      <div class="control-group">
        <div class="label-side">{{ t('home.tools.password.special') }}</div>
        <div class="content-side">
          <label><input type="checkbox" v-model="options.special"> {{ t('home.tools.password.special') }}</label>
          <input type="text" v-model="options.specialChars" :disabled="!options.special">
          <label><input type="checkbox" v-model="options.excludeSimilar"> {{ t('home.tools.password.excludeSimilar') }}</label>
        </div>
      </div>

      <div class="control-group">
        <div class="label-side">{{ t('home.tools.password.length') }}</div>
        <div class="content-side">
          <select v-model="passwordLength">
            <option :value="8">{{ t('home.tools.password.bits', { n: 8 }) }} ({{ t('home.tools.password.strengthLevels.low') }})</option>
            <option :value="12">{{ t('home.tools.password.bits', { n: 12 }) }} ({{ t('home.tools.password.strengthLevels.med') }})</option>
            <option :value="16">{{ t('home.tools.password.bits', { n: 16 }) }} ({{ t('home.tools.password.strengthLevels.high') }})</option>
            <option :value="20">{{ t('home.tools.password.bits', { n: 20 }) }} ({{ t('home.tools.password.strengthLevels.high') }})</option>
            <option :value="32">{{ t('home.tools.password.bits', { n: 32 }) }} ({{ t('home.tools.password.strengthLevels.ultra') }})</option>
            <option :value="64">{{ t('home.tools.password.bits', { n: 64 }) }} ({{ t('home.tools.password.strengthLevels.ultra') }})</option>
          </select>
          <span style="color: #2196f3; font-size: 0.9rem;">{{ t('home.tools.password.lengthHint') }}</span>
        </div>
      </div>

      <div class="control-group">
        <div class="label-side">{{ t('home.tools.password.quantity') }}</div>
        <div class="content-side">
          <select v-model="quantity">
            <option v-for="n in [1, 5, 10, 20, 50]" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>

      <button class="btn-generate" @click="generatePasswords">{{ t('home.tools.password.generate') }}</button>

      <div v-if="passwords.length > 0">
        <table class="result-table">
          <thead>
            <tr>
              <th style="width: 60px;">{{ t('home.tools.password.index') }}</th>
              <th>{{ t('home.tools.password.password') }}</th>
              <th style="width: 100px;">{{ t('home.tools.password.strength') }}</th>
              <th style="width: 80px;">{{ t('common.action') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in passwords" :key="p.id">
              <td>{{ p.id }}</td>
              <td style="font-family: monospace; font-size: 1.1rem; color: #555;">{{ p.value }}</td>
              <td>
                <span class="strength-tag" :class="getStrengthClass(p.strength)">
                  {{ t(`home.tools.password.strengthLevels.${p.strength}`) }}
                </span>
              </td>
              <td>
                <button class="btn-copy" @click="copyToClipboard(p.value, p.id)">
                  {{ copiedId === p.id ? t('common.copied') : t('common.copy') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.95rem;
}

.view-container {
  width: 100%;
  max-width: 800px;
}

.back-nav {
  margin-bottom: 20px;
}

.btn-back {
  text-decoration: none;
  color: #7c4dff;
  font-weight: bold;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.btn-back:hover {
  opacity: 0.7;
}
</style>
