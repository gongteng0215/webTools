<script setup>
import { ref, computed } from 'vue'
import { diff_match_patch } from 'diff-match-patch'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const text1 = ref('Hello World\nThis is a test of the diff utility.\nSome lines stay the same.')
const text2 = ref('Hello Everyone\nThis is a test of the diff engine.\nSome lines stay the same.\nAdded a new line here!')

const dmp = new diff_match_patch()

const diffHtml = computed(() => {
  if (text1.value === undefined || text2.value === undefined) return ''
  
  const diffs = dmp.diff_main(text1.value, text2.value)
  dmp.diff_cleanupSemantic(diffs)
  
  return dmp.diff_prettyHtml(diffs)
})

const clearAll = () => {
  text1.value = ''
  text2.value = ''
}
</script>

<template>
  <div class="tool-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="tool-card">
      <div class="tool-header">
        <h1 class="title">{{ t('home.tools.diff.title') }}</h1>
        <button @click="clearAll" class="btn-clear">{{ t('common.clear') }}</button>
      </div>

      <div class="diff-editor">
        <div class="input-panes">
          <div class="pane">
            <label>{{ t('home.tools.diff.original') }} (A)</label>
            <textarea v-model="text1" :placeholder="t('home.tools.diff.original') + '...'" spellcheck="false"></textarea>
          </div>
          <div class="pane">
            <label>{{ t('home.tools.diff.modified') }} (B)</label>
            <textarea v-model="text2" :placeholder="t('home.tools.diff.modified') + '...'" spellcheck="false"></textarea>
          </div>
        </div>

        <div class="result-pane">
          <label>{{ t('home.tools.diff.diff') }}</label>
          <div class="diff-viewer" v-html="diffHtml"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { width: 100%; max-width: 1200px; margin: 0 auto; height: 90vh; display: flex; flex-direction: column; }
.back-nav { margin-bottom: 20px; }
.btn-back { text-decoration: none; color: #ff9f43; font-weight: bold; }

.tool-card {
  background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px;
  flex: 1; display: flex; flex-direction: column;
}

.tool-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.title { font-size: 1.5rem; margin: 0; color: #2d3436; }
.btn-clear { background: #f1f2f6; border: 1px solid #ddd; padding: 8px 15px; border-radius: 6px; cursor: pointer; color: #636e72; }

.diff-editor { flex: 1; display: flex; flex-direction: column; gap: 20px; overflow: hidden; }

.input-panes { display: flex; gap: 20px; height: 35%; }
.pane { flex: 1; display: flex; flex-direction: column; }
.pane label, .result-pane label { font-size: 0.75rem; color: #b2bec3; font-weight: bold; margin-bottom: 8px; text-transform: uppercase; }

textarea { flex: 1; border: 1px solid #eee; border-radius: 8px; padding: 15px; font-family: 'Fira Code', monospace; font-size: 0.9rem; resize: none; outline: none; background: #fafafa; }
textarea:focus { background: white; border-color: #ff9f43; }

.result-pane { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.diff-viewer {
  flex: 1; border: 1px solid #eee; border-radius: 8px; padding: 20px; font-family: 'Fira Code', monospace;
  font-size: 0.95rem; overflow-y: auto; white-space: pre-wrap; word-break: break-all; background: #fff; line-height: 1.6;
}

:deep(ins) { background: #e6ffec; color: #24292e; text-decoration: none; border-bottom: 1px solid #acf2bd; font-weight: bold; }
:deep(del) { background: #ffeef0; color: #24292e; text-decoration: none; border-bottom: 1px solid #fdb8c0; }
</style>
