<script setup>
import { ref, onMounted, watch } from 'vue'
import QRCode from 'qrcode'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const qrInput = ref('https://github.com')
const qrUrl = ref('')
const qrSize = ref(300)
const errorCorrectionLevel = ref('M')
const error = ref('')

const generateQR = async () => {
  if (!qrInput.value.trim()) {
    qrUrl.value = ''
    return
  }
  
  try {
    error.value = ''
    const url = await QRCode.toDataURL(qrInput.value, {
      width: qrSize.value,
      margin: 2,
      errorCorrectionLevel: errorCorrectionLevel.value,
      color: {
        dark: '#2d3436',
        light: '#ffffff'
      }
    })
    qrUrl.value = url
  } catch (err) {
    error.value = t('home.tools.config.error', { e: err.message })
    console.error(err)
  }
}

const downloadQR = () => {
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = qrUrl.value
  link.click()
}

watch([qrInput, qrSize, errorCorrectionLevel], generateQR)

onMounted(generateQR)
</script>

<template>
  <div class="tool-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="tool-card">
      <h1 class="title">{{ t('home.tools.qrcode.title') }}</h1>

      <div class="qr-layout">
        <div class="setup-pane">
          <div class="input-item">
            <label>{{ t('home.tools.qrcode.text') }}</label>
            <textarea v-model="qrInput" :placeholder="t('home.tools.qrcode.text') + '...'" spellcheck="false"></textarea>
          </div>

          <div class="config-grid">
            <div class="input-item">
              <label>{{ t('home.tools.qrcode.size') }} (px)</label>
              <input type="number" v-model.number="qrSize" step="50" min="100" max="1000">
            </div>
            <div class="input-item">
              <label>{{ t('home.tools.crypto.mode') }}</label>
              <select v-model="errorCorrectionLevel">
                <option value="L">L (7%)</option>
                <option value="M">M (15%)</option>
                <option value="Q">Q (25%)</option>
                <option value="H">H (30%)</option>
              </select>
            </div>
          </div>
          
          <button v-if="qrUrl" @click="downloadQR" class="btn-download">{{ t('home.tools.qrcode.download') }}</button>
        </div>

        <div class="preview-pane">
          <div class="qr-box">
            <img v-if="qrUrl" :src="qrUrl" alt="QR Code">
            <div v-else-if="error" class="qr-error">{{ error }}</div>
            <div v-else class="qr-placeholder">{{ t('home.tools.qrcode.text') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { width: 100%; max-width: 900px; margin: 0 auto; }
.btn-back { text-decoration: none; color: #2d3436; font-weight: bold; margin-bottom: 20px; display: inline-block; }

.tool-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; }
.title { font-size: 1.5rem; margin: 0 0 30px; color: #2d3436; }

.qr-layout { display: flex; gap: 40px; }
.setup-pane { flex: 1.2; display: flex; flex-direction: column; gap: 20px; }
.preview-pane { flex: 1; display: flex; justify-content: center; align-items: flex-start; }

.input-item { display: flex; flex-direction: column; gap: 8px; }
.input-item label { font-size: 0.8rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; }

textarea { width: 100%; height: 120px; padding: 15px; border: 1px solid #eee; border-radius: 8px; font-size: 1rem; background: #fafafa; resize: none; outline: none; transition: border-color 0.2s; font-family: 'Fira Code', monospace; }
textarea:focus { border-color: #2d3436; background: white; }

.config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.config-grid input, .config-grid select { padding: 10px; border: 1px solid #eee; border-radius: 8px; background: white; outline: none; font-family: 'Fira Code', monospace; }

.btn-download { background: #2d3436; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 10px; }

.qr-box { width: 100%; max-width: 320px; aspect-ratio: 1; background: #fafafa; border: 1px solid #eee; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 15px; }
.qr-box img { max-width: 100%; height: auto; }
.qr-placeholder { font-size: 0.9rem; color: #b2bec3; }
.qr-error { color: #ff7675; font-size: 0.9rem; }

@media (max-width: 700px) {
  .qr-layout { flex-direction: column; }
}
</style>
