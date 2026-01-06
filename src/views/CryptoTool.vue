<script setup>
import { ref, watch, computed } from 'vue'
import CryptoJS from 'crypto-js'
import { JSEncrypt } from 'jsencrypt'
import nacl from 'tweetnacl'
import naclUtil from 'tweetnacl-util'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const inputText = ref('')
const outputText = ref('')
const algorithm = ref('MD5')
const mode = ref('encrypt') // encrypt or decrypt
const secretKey = ref('')
const iv = ref('')

// RSA/Asymmetric
const publicKey = ref('')
const privateKey = ref('')
const rsaBits = ref(2048)

const algorithms = computed(() => [
  { label: t('crypto.hash'), options: ['MD5', 'SHA1', 'SHA256', 'SHA512'] },
  { label: t('crypto.symmetric'), options: ['AES', 'DES'] },
  { label: t('crypto.asymmetric'), options: ['RSA', 'Ed25519'] },
  { label: t('crypto.encoding'), options: ['Base64', 'URL'] }
])

const processCrypto = () => {
  if (!inputText.value) {
    outputText.value = ''
    return
  }

  try {
    let result = ''
    const currentAlgo = algorithm.value

    if (currentAlgo === 'MD5') {
      result = CryptoJS.MD5(inputText.value).toString()
    } else if (currentAlgo === 'SHA1') {
      result = CryptoJS.SHA1(inputText.value).toString()
    } else if (currentAlgo === 'SHA256') {
      result = CryptoJS.SHA256(inputText.value).toString()
    } else if (currentAlgo === 'SHA512') {
      result = CryptoJS.SHA512(inputText.value).toString()
    } else if (currentAlgo === 'AES') {
      if (mode.value === 'encrypt') {
        result = CryptoJS.AES.encrypt(inputText.value, secretKey.value, { 
          iv: iv.value ? CryptoJS.enc.Utf8.parse(iv.value) : undefined 
        }).toString()
      } else {
        const bytes = CryptoJS.AES.decrypt(inputText.value, secretKey.value, { 
          iv: iv.value ? CryptoJS.enc.Utf8.parse(iv.value) : undefined 
        })
        result = bytes.toString(CryptoJS.enc.Utf8)
      }
    } else if (currentAlgo === 'DES') {
      if (mode.value === 'encrypt') {
        result = CryptoJS.DES.encrypt(inputText.value, secretKey.value, {
          iv: iv.value ? CryptoJS.enc.Utf8.parse(iv.value) : undefined
        }).toString()
      } else {
        const bytes = CryptoJS.DES.decrypt(inputText.value, secretKey.value, {
          iv: iv.value ? CryptoJS.enc.Utf8.parse(iv.value) : undefined
        })
        result = bytes.toString(CryptoJS.enc.Utf8)
      }
    } else if (currentAlgo === 'Base64') {
      if (mode.value === 'encrypt') {
        result = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(inputText.value))
      } else {
        result = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(inputText.value))
      }
    } else if (currentAlgo === 'RSA') {
      const encryptor = new JSEncrypt()
      if (mode.value === 'encrypt') {
        if (!publicKey.value) throw new Error(t('crypto.publicKey') + ' required')
        encryptor.setPublicKey(publicKey.value)
        result = encryptor.encrypt(inputText.value)
        if (!result) throw new Error('Encryption failed')
      } else {
        if (!privateKey.value) throw new Error(t('crypto.privateKey') + ' required')
        encryptor.setPrivateKey(privateKey.value)
        result = encryptor.decrypt(inputText.value)
        if (!result) throw new Error('Decryption failed')
      }
    } else if (currentAlgo === 'Ed25519') {
      if (mode.value === 'encrypt') {
        result = 'Ed25519 is for signing, not direct encryption.'
      } else {
        result = 'Ed25519 decryption mode not supported directly.'
      }
    } else if (currentAlgo === 'URL') {
      if (mode.value === 'encrypt') {
        result = encodeURIComponent(inputText.value)
      } else {
        result = decodeURIComponent(inputText.value)
      }
    }

    outputText.value = result
  } catch (e) {
    outputText.value = t('common.error') + ': ' + e.message
  }
}

watch([inputText, algorithm, mode, secretKey, iv, publicKey, privateKey, rsaBits], processCrypto)

const generateKeys = () => {
  if (algorithm.value === 'RSA') {
    const encryptor = new JSEncrypt({ default_key_size: parseInt(rsaBits.value) })
    publicKey.value = encryptor.getPublicKey()
    privateKey.value = encryptor.getPrivateKey()
  } else if (algorithm.value === 'Ed25519') {
    const keyPair = nacl.sign.keyPair()
    publicKey.value = naclUtil.encodeBase64(keyPair.publicKey)
    privateKey.value = naclUtil.encodeBase64(keyPair.secretKey)
  }
}

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
}

const copyResult = () => {
  if (outputText.value) {
    navigator.clipboard.writeText(outputText.value)
    alert(t('common.copied'))
  }
}

const isSymmetric = () => ['AES', 'DES'].includes(algorithm.value)
const isAsymmetric = () => ['RSA', 'Ed25519'].includes(algorithm.value)
const canDecrypt = () => ['AES', 'DES', 'Base64', 'URL', 'RSA'].includes(algorithm.value)
</script>

<template>
  <div class="view-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="crypto-card">
      <div class="crypto-header">
        <h1 class="title">{{ t('home.tools.crypto.title') }}</h1>
        <div class="toolbar">
          <select v-model="algorithm" class="select-algo">
            <optgroup v-for="group in algorithms" :key="group.label" :label="group.label">
              <option v-for="opt in group.options" :key="opt" :value="opt">{{ opt }}</option>
            </optgroup>
          </select>

          <div v-if="canDecrypt()" class="mode-switch">
            <button @click="mode = 'encrypt'" :class="{ active: mode === 'encrypt' }">{{ t('crypto.encrypt') }}</button>
            <button @click="mode = 'decrypt'" :class="{ active: mode === 'decrypt' }">{{ t('crypto.decrypt') }}</button>
          </div>

          <button @click="clearAll" class="btn-clear">{{ t('common.clear') }}</button>
          <button @click="copyResult" class="btn-primary" :disabled="!outputText">{{ t('common.copy') }}</button>
        </div>
      </div>

      <div v-if="isSymmetric()" class="config-bar">
        <div class="config-item">
          <label>{{ t('crypto.key') }}:</label>
          <input type="text" v-model="secretKey" :placeholder="t('crypto.key') + '...'">
        </div>
        <div class="config-item">
          <label>{{ t('crypto.iv') }}:</label>
          <input type="text" v-model="iv" :placeholder="t('crypto.iv') + ' (16 chars)...'">
        </div>
      </div>

      <div v-if="isAsymmetric()" class="config-bar rsa-config">
        <div class="config-item rsa-options" v-if="algorithm === 'RSA'">
          <label>{{ t('crypto.bitSize') }}:</label>
          <select v-model="rsaBits" class="select-bits">
            <option :value="1024">1024</option>
            <option :value="2048">2048</option>
            <option :value="4096">4096</option>
          </select>
        </div>
        <div class="config-item full-width">
          <label>{{ t('crypto.publicKey') }}:</label>
          <textarea v-model="publicKey" :placeholder="t('crypto.publicKey') + '...'"></textarea>
        </div>
        <div class="config-item full-width">
          <label>{{ t('crypto.privateKey') }}:</label>
          <textarea v-model="privateKey" :placeholder="t('crypto.privateKey') + '...'"></textarea>
        </div>
        <div class="config-actions">
          <button @click="generateKeys" class="btn-gen-keys">{{ t('crypto.generateKeys') }}</button>
        </div>
      </div>

      <div class="editor-panes">
        <div class="pane">
          <textarea v-model="inputText" :placeholder="t('common.input') + '...'"></textarea>
          <div class="pane-label">{{ t('common.input') }}</div>
        </div>
        <div class="pane">
          <textarea v-model="outputText" readonly :placeholder="t('common.output') + '...'"></textarea>
          <div class="pane-label">{{ t('common.output') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container { width: 100%; max-width: 1200px; }
.back-nav { margin-bottom: 20px; }
.btn-back { text-decoration: none; color: #ff7675; font-weight: bold; }

.crypto-card {
  background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: flex; flex-direction: column; overflow: hidden; height: 80vh;
}

.crypto-header {
  padding: 15px 25px; background: #f8f9fa; border-bottom: 1px solid #eee;
  display: flex; justify-content: space-between; align-items: center; gap: 15px;
}
.title { font-size: 1.25rem; margin: 0; color: #2d3436; }

.toolbar { display: flex; gap: 10px; align-items: center; }
.select-algo, .toolbar button {
  padding: 8px 12px; border-radius: 6px; border: 1px solid #ddd;
  background: white; font-size: 0.9rem; cursor: pointer;
}

.mode-switch { display: flex; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
.mode-switch button { border: none; border-radius: 0; background: white; padding: 8px 15px; }
.mode-switch button.active { background: #ff7675; color: white; }

.btn-primary { background: #ff7675 !important; color: white !important; border-color: #ff7675 !important; }

.config-bar { padding: 15px 25px; background: #fffcfc; border-bottom: 1px solid #eee; display: flex; gap: 30px; flex-wrap: wrap; }
.rsa-config { flex-direction: column; gap: 15px; }
.config-item { display: flex; align-items: center; gap: 10px; }
.config-item.full-width { flex-direction: column; align-items: flex-start; width: 100%; }
.config-item label { font-size: 0.9rem; color: #636e72; font-weight: bold; margin-bottom: 5px; }
.config-item input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; width: 250px; }
.config-item textarea { width: 100%; height: 80px; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-family: monospace; font-size: 0.85rem; }

.btn-gen-keys { background: #ff7675; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; }

.editor-panes { flex: 1; display: flex; min-height: 300px; }
.pane { flex: 1; position: relative; border-right: 1px solid #eee; }
.pane:last-child { border-right: none; background: #fafafa; }
textarea { width: 100%; height: 100%; padding: 40px 20px 20px; border: none; resize: none; font-family: 'Fira Code', monospace; font-size: 1rem; outline: none; background: transparent; }
.pane-label { position: absolute; top: 10px; left: 20px; font-size: 0.75rem; color: #b2bec3; text-transform: uppercase; font-weight: bold; }
</style>
