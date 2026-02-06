<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast } from '../utils/toast'

const { t } = useI18n()

const base64Str = ref('')
const fileName = ref('')
const fileSize = ref(0)
const previewUrl = ref('')
const isDragging = ref(false)

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) processFile(file)
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

const processFile = (file) => {
  if (!file.type.startsWith('image/')) {
    alert(t('home.tools.image.invalid'))
    return
  }
  
  fileName.value = file.name
  fileSize.value = (file.size / 1024).toFixed(2)
  
  const reader = new FileReader()
  reader.onload = (e) => {
    base64Str.value = e.target.result
    previewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleBase64Input = () => {
  let str = base64Str.value.trim()
  if (!str) {
    previewUrl.value = ''
    return
  }

  if (!str.startsWith('data:image/')) {
    str = 'data:image/png;base64,' + str
  }
  
  previewUrl.value = str
}

const copyBase64 = () => {
  if (!base64Str.value) return
  navigator.clipboard.writeText(base64Str.value)
  showToast(t('common.copied'))
}

const downloadImage = () => {
  if (!previewUrl.value) return
  const link = document.createElement('a')
  link.href = previewUrl.value
  link.download = fileName.value || 'downloaded-image.png'
  link.click()
}

const clearAll = () => {
  base64Str.value = ''
  previewUrl.value = ''
  fileName.value = ''
  fileSize.value = 0
}

watch(base64Str, (newVal) => {
  if (!newVal) {
    previewUrl.value = ''
  }
})
</script>

<template>
  <div class="tool-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="tool-card">
      <h1 class="title">{{ t('home.tools.image.title') }}</h1>

      <div class="uploader-section" 
           :class="{ dragging: isDragging }"
           @dragover.prevent="isDragging = true"
           @dragleave.prevent="isDragging = false"
           @drop.prevent="handleDrop">
        
        <div v-if="!previewUrl" class="upload-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p>{{ t('home.tools.image.placeholder') }} <label class="link-label">{{ t('home.tools.image.upload') }} <input type="file" @change="handleFileUpload" accept="image/*" hidden></label></p>
          <p class="secondary-hint">{{ t('home.tools.image.hint') }}</p>
        </div>

        <div v-else class="preview-box">
          <img :src="previewUrl" alt="Preview" @error="previewUrl = ''">
          <div class="file-info">
            <span v-if="fileName">{{ fileName }} ({{ fileSize }} KB)</span>
            <span v-else>{{ t('home.tools.image.previewArea') }}</span>
            <div class="action-btns">
              <button @click="downloadImage" class="btn-download">{{ t('home.tools.image.download') }}</button>
              <button @click="clearAll" class="btn-clear">{{ t('common.clear') }}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="output-section">
        <div class="header">
          <h3>{{ t('home.tools.image.base64Area') }}</h3>
          <div class="header-actions">
            <button v-if="base64Str" @click="copyBase64" class="btn-copy small">{{ t('home.tools.image.copyBase64') }}</button>
            <button v-if="base64Str" @click="clearAll" class="btn-sub small">{{ t('common.clear') }}</button>
          </div>
        </div>
        <textarea 
          v-model="base64Str" 
          @input="handleBase64Input"
          :placeholder="t('home.tools.image.placeholderBase64')"
          spellcheck="false"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { width: 100%; max-width: 900px; margin: 0 auto; }
.btn-back { text-decoration: none; color: var(--primary); font-weight: bold; margin-bottom: 20px; display: inline-block; }

.tool-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; }
.title { font-size: 1.5rem; margin: 0 0 25px; color: #2d3436; }

.uploader-section {
  border: 2px dashed #dfe6e9; border-radius: 12px; min-height: 250px;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  background: #fafafa; margin-bottom: 30px;
}
.uploader-section.dragging { background: #e3f2fd; border-color: #0984e3; }

.upload-placeholder { text-align: center; color: #636e72; }
.upload-placeholder svg { width: 48px; height: 48px; color: #b2bec3; margin-bottom: 15px; }
.link-label { color: #0984e3; cursor: pointer; text-decoration: underline; }
.secondary-hint { font-size: 0.8rem; color: #b2bec3; margin-top: 10px; }

.preview-box { width: 100%; padding: 20px; display: flex; flex-direction: column; align-items: center; }
.preview-box img { max-width: 100%; max-height: 350px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-bottom: 15px; background: repeating-conic-gradient(#f0f0f0 0% 25%, #fff 0% 50%) 50% / 20px 20px; }
.file-info { display: flex; flex-direction: column; gap: 10px; align-items: center; font-size: 0.9rem; color: #636e72; width: 100%; }
.action-btns { display: flex; gap: 10px; }

.btn-download { background: var(--primary); color: white; border: none; padding: 6px 15px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn-clear { background: var(--primary-soft); color: var(--primary); border: 1px solid var(--primary-border); padding: 6px 15px; border-radius: 6px; cursor: pointer; }

.output-section .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.output-section h3 { font-size: 0.8rem; color: #b2bec3; margin: 0; text-transform: uppercase; font-weight: bold; }
.header-actions { display: flex; gap: 10px; }

textarea { width: 100%; height: 250px; border: 1px solid #eee; border-radius: 8px; padding: 15px; font-family: 'Fira Code', monospace; font-size: 0.8rem; background: #fafafa; resize: none; overflow-y: auto; word-break: break-all; outline: none; transition: border-color 0.2s; }
textarea:focus { border-color: #0984e3; background: #fff; }

.btn-copy.small { background: var(--primary); color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
.btn-sub.small { background: var(--primary-soft); border: 1px solid var(--primary-border); padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; color: var(--primary); }
</style>
