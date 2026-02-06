<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import 'github-markdown-css/github-markdown.css'
import { showToast } from '../utils/toast'

const { t } = useI18n()

const input = ref('# Markdown Preview\n\nStart typing here...')
const previewHtml = ref('')

const updatePreview = () => {
  previewHtml.value = marked.parse(input.value)
}

watch(input, updatePreview, { immediate: true })

const clear = () => {
  input.value = ''
}

const copyHtml = () => {
  navigator.clipboard.writeText(previewHtml.value)
  showToast(t('common.copied'))
}
</script>

<template>
  <div class="view-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="card md-card">
      <div class="header">
        <h1>{{ t('home.tools.markdown.title') }}</h1>
        <div class="actions">
          <button @click="copyHtml" class="btn-sub" v-if="previewHtml">{{ t('common.copy') }} HTML</button>
          <button @click="clear" class="btn-sub">{{ t('common.clear') }}</button>
        </div>
      </div>

      <div class="md-editor">
        <div class="pane editor-pane">
          <div class="pane-header">
            <label>{{ t('common.input') }}</label>
          </div>
          <textarea v-model="input" :placeholder="t('home.tools.markdown.placeholder')" spellcheck="false"></textarea>
        </div>

        <div class="pane preview-pane">
          <div class="pane-header">
            <label>{{ t('home.tools.markdown.preview') }}</label>
          </div>
          <div class="markdown-body" v-html="previewHtml"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container { width: 100%; max-width: 1200px; margin: 0 auto; }
.back-nav { margin-bottom: 20px; }
.btn-back { text-decoration: none; color: var(--primary); font-weight: bold; }

.md-card { 
  background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
  padding: 0; overflow: hidden; display: flex; flex-direction: column; height: calc(100vh - 150px);
}

.header { padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; }
.header h1 { margin: 0; font-size: 1.5rem; color: #2d3436; }

.md-editor { display: flex; flex: 1; overflow: hidden; }

.pane { flex: 1; display: flex; flex-direction: column; }
.editor-pane { border-right: 1px solid #eee; }

.pane-header { padding: 10px 20px; background: #fafafa; border-bottom: 1px solid #eee; }
.pane-header label { font-size: 0.75rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; }

textarea { 
  flex: 1; border: none; padding: 20px; font-family: 'Fira Code', monospace; 
  font-size: 1rem; line-height: 1.6; resize: none; outline: none; background: #fff;
}

.markdown-body { 
  flex: 1; padding: 30px; overflow-y: auto; background: #fff;
  font-size: 16px;
}

/* Custom scrollbars */
.markdown-body::-webkit-scrollbar, textarea::-webkit-scrollbar { width: 8px; }
.markdown-body::-webkit-scrollbar-thumb, textarea::-webkit-scrollbar-thumb { background: #eee; border-radius: 4px; }
.markdown-body::-webkit-scrollbar-thumb:hover, textarea::-webkit-scrollbar-thumb:hover { background: #ddd; }

.actions { display: flex; gap: 10px; }
.btn-sub { 
  background: var(--primary-soft); border: 1px solid var(--primary-border); padding: 6px 15px; 
  border-radius: 6px; cursor: pointer; font-size: 0.85rem; color: var(--primary);
}
.btn-sub:hover { background: var(--primary); color: white; border-color: var(--primary); }
</style>
