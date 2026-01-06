<script setup>
import { ref, watch, onMounted } from 'vue'
import * as jose from 'jose'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const encodedToken = ref('')
const headerJson = ref('')
const payloadJson = ref('')
const signatureStatus = ref('neutral') // neutral, valid, invalid
const secret = ref('your-256-bit-secret')
const isJWE = ref(false)

// 算法状态
const algorithm = ref('HS256') // JWS Alg
const jweAlg = ref('dir')      // JWE Key Management
const jweEnc = ref('A256GCM')  // JWE Content Encryption

const decodeToken = async () => {
  if (!encodedToken.value) {
    headerJson.value = ''
    payloadJson.value = ''
    signatureStatus.value = 'neutral'
    return
  }

  try {
    const parts = encodedToken.value.split('.')
    
    // 如果是 5 段式，自动识别为 JWE
    if (parts.length === 5) {
      isJWE.value = true
      const header = JSON.parse(new TextDecoder().decode(jose.base64url.decode(parts[0])))
      headerJson.value = JSON.stringify(header, null, 2)
      
      if (header.alg) jweAlg.value = header.alg
      if (header.enc) jweEnc.value = header.enc
      
      await decryptJWE()
    } else if (parts.length === 3) {
      isJWE.value = false
      const header = JSON.parse(new TextDecoder().decode(jose.base64url.decode(parts[0])))
      const payload = JSON.parse(new TextDecoder().decode(jose.base64url.decode(parts[1])))

      headerJson.value = JSON.stringify(header, null, 2)
      payloadJson.value = JSON.stringify(payload, null, 2)
      
      if (header.alg) algorithm.value = header.alg
      verifyJWS()
    } else {
      throw new Error('Invalid JWT/JWE format')
    }
  } catch (e) {
    headerJson.value = t('common.error') + ': ' + e.message
    payloadJson.value = ''
    signatureStatus.value = 'invalid'
  }
}

const verifyJWS = async () => {
  if (!encodedToken.value || !secret.value) return
  try {
    if (algorithm.value === 'HS256') {
      const secretBytes = new TextEncoder().encode(secret.value)
      await jose.jwtVerify(encodedToken.value, secretBytes)
      signatureStatus.value = 'valid'
    } else {
      signatureStatus.value = 'neutral'
    }
  } catch (e) {
    signatureStatus.value = 'invalid'
  }
}

const decryptJWE = async () => {
  if (!encodedToken.value || !secret.value) return
  try {
    const secretBytes = new TextEncoder().encode(secret.value.padEnd(32, '0').substring(0, 32))
    const { payload } = await jose.compactDecrypt(encodedToken.value, secretBytes)
    payloadJson.value = JSON.stringify(JSON.parse(new TextDecoder().decode(payload)), null, 2)
    signatureStatus.value = 'valid'
  } catch (e) {
    payloadJson.value = t('common.error') + ': ' + e.message
    signatureStatus.value = 'invalid'
  }
}

const updateToken = async () => {
  try {
    const header = JSON.parse(headerJson.value)
    const payload = JSON.parse(payloadJson.value)
    
    if (!isJWE.value) {
      if (algorithm.value === 'HS256') {
        const secretBytes = new TextEncoder().encode(secret.value)
        const token = await new jose.SignJWT(payload)
          .setProtectedHeader(header)
          .sign(secretBytes)
        encodedToken.value = token
        signatureStatus.value = 'valid'
      }
    } else {
      if (jweAlg.value === 'dir') {
        const secretBytes = new TextEncoder().encode(secret.value.padEnd(32, '0').substring(0, 32))
        const jwt = await new jose.EncryptJWT(payload)
          .setProtectedHeader({ alg: 'dir', enc: jweEnc.value, ...header })
          .encrypt(secretBytes)
        encodedToken.value = jwt
        signatureStatus.value = 'valid'
      }
    }
  } catch (e) {}
}

watch(encodedToken, () => {
  decodeToken()
})

watch([headerJson, payloadJson, secret, algorithm, jweAlg, jweEnc, isJWE], () => {
  updateToken()
})

const clearAll = () => {
  encodedToken.value = ''
  headerJson.value = ''
  payloadJson.value = ''
  signatureStatus.value = 'neutral'
}

const copyToken = () => {
  if (encodedToken.value) {
    navigator.clipboard.writeText(encodedToken.value)
    alert(t('common.copied'))
  }
}

onMounted(() => {
  encodedToken.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
})
</script>

<template>
  <div class="view-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="jwt-card">
      <div class="jwt-header">
        <h1 class="title">{{ t('home.tools.jwt.title') }}</h1>
        <div class="mode-tabs">
          <button @click="isJWE = false" :class="{ active: !isJWE }">JWS (Sign)</button>
          <button @click="isJWE = true" :class="{ active: isJWE }">JWE (Encrypt)</button>
        </div>
        <div class="toolbar">
          <select v-if="!isJWE" v-model="algorithm" class="select-algo">
            <option value="HS256">HS256 (HMAC + SHA256)</option>
            <option value="RS256">RS256 (RSA + SHA256)</option>
          </select>
          <div v-else class="jwe-algos">
            <select v-model="jweAlg" class="select-algo">
              <option value="dir">dir (Direct)</option>
              <option value="A256KW">A256KW</option>
            </select>
            <select v-model="jweEnc" class="select-algo">
              <option value="A256GCM">A256GCM</option>
              <option value="A128GCM">A128GCM</option>
            </select>
          </div>
          <button @click="clearAll" class="btn-clear">{{ t('common.clear') }}</button>
          <button @click="copyToken" class="btn-primary" :disabled="!encodedToken">{{ t('common.copy') }}</button>
        </div>
      </div>

      <div class="debugger-layout">
        <div class="pane encoded-pane">
          <div class="pane-header">{{ t('home.tools.jwt.token') }}</div>
          <textarea 
            v-model="encodedToken" 
            placeholder="Paste JWT/JWE..." 
            spellcheck="false"
            class="token-textarea"
          ></textarea>
        </div>

        <div class="pane decoded-pane">
          <div class="decoded-section">
            <div class="pane-header header-color">{{ t('home.tools.jwt.header') }}</div>
            <textarea v-model="headerJson" spellcheck="false" class="json-textarea"></textarea>
          </div>
          
          <div class="decoded-section">
            <div class="pane-header payload-color">{{ t('home.tools.jwt.payload') }}</div>
            <textarea v-model="payloadJson" spellcheck="false" class="json-textarea"></textarea>
          </div>

          <div class="decoded-section signature-section">
            <div class="pane-header signature-color">{{ t('home.tools.jwt.signature') }}</div>
            <div class="signature-config">
              <div class="config-item">
                <label>{{ isJWE ? t('home.tools.jwt.secret') : t('home.tools.jwt.secret') }}:</label>
                <input type="text" v-model="secret" placeholder="Enter secret...">
              </div>
              
              <div class="verify-status" :class="signatureStatus">
                <span v-if="signatureStatus === 'valid'">✅ {{ isJWE ? t('home.tools.jwt.verified') : t('home.tools.jwt.verified') }}</span>
                <span v-else-if="signatureStatus === 'invalid'">❌ {{ isJWE ? t('home.tools.jwt.unverified') : t('home.tools.jwt.unverified') }}</span>
                <span v-else>⚠️ Neutral</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container { width: 100%; max-width: 1200px; height: 85vh; display: flex; flex-direction: column; }
.back-nav { margin-bottom: 20px; }
.btn-back { text-decoration: none; color: #3498db; font-weight: bold; }
.jwt-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); flex: 1; display: flex; flex-direction: column; overflow: hidden; border: 1px solid #eee; }
.jwt-header { padding: 15px 25px; background: #f8f9fa; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.title { font-size: 1.25rem; margin: 0; color: #2d3436; }
.mode-tabs { display: flex; background: #eee; border-radius: 8px; padding: 4px; }
.mode-tabs button { border: none; background: transparent; padding: 6px 15px; cursor: pointer; border-radius: 6px; font-size: 0.85rem; color: #636e72; transition: all 0.2s; }
.mode-tabs button.active { background: white; color: #3498db; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.toolbar { display: flex; gap: 10px; align-items: center; }
.select-algo { padding: 8px 12px; border-radius: 6px; border: 1px solid #ddd; background: white; font-size: 0.9rem; }
.jwe-algos { display: flex; gap: 5px; }
.btn-primary { background: #3498db !important; color: white !important; border-color: #3498db !important; }
.btn-clear { background: white; border: 1px solid #ddd; padding: 8px 15px; border-radius: 6px; cursor: pointer; color: #666; }

.debugger-layout { flex: 1; display: flex; overflow: hidden; }
.pane { flex: 1; display: flex; flex-direction: column; }
.encoded-pane { border-right: 1px solid #eee; background: #fcfcfc; }
.pane-header { padding: 8px 20px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: #7f8c8d; background: #f1f2f6; letter-spacing: 1px; }
.header-color { border-left: 4px solid #fb015b; }
.payload-color { border-left: 4px solid #d633ff; }
.signature-color { border-left: 4px solid #00b9f1; }
.token-textarea { flex: 1; width: 100%; border: none; padding: 20px; font-family: 'Fira Code', monospace; font-size: 14px; line-height: 1.8; resize: none; background: transparent; outline: none; color: #d633ff; word-break: break-all; }
.decoded-pane { overflow-y: auto; background: white; }
.decoded-section { border-bottom: 1px solid #eee; }
.json-textarea { width: 100%; min-height: 120px; border: none; padding: 15px 20px; font-family: 'Fira Code', monospace; font-size: 13px; outline: none; color: #2c3e50; }
.signature-section { background: #fafbfc; flex: 1; }
.signature-config { padding: 20px; }
.config-item label { display: block; font-size: 0.85rem; color: #7f8c8d; margin-bottom: 8px; }
.config-item input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-family: monospace; }
.verify-status { padding: 12px; border-radius: 6px; font-size: 0.9rem; font-weight: bold; text-align: center; margin-top: 15px; }
.valid { background: #e8f8f5; color: #1abc9c; border: 1px solid #1abc9c; }
.invalid { background: #fdedec; color: #e74c3c; border: 1px solid #e74c3c; }
.neutral { background: #fef9e7; color: #f39c12; border: 1px solid #f39c12; }
</style>
