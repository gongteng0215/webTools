<script setup>
import { ref, watch } from 'vue'
import { format } from 'sql-formatter'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const sqlInput = ref("SELECT a,b,c FROM table_test JOIN other_table ON table_test.id = other_table.id WHERE a > 10 AND b LIKE '%test%' ORDER BY c DESC LIMIT 10")
const sqlOutput = ref('')
const dialect = ref('sql') // sql, mysql, postgresql, sqlite, etc
const isUppercase = ref(true)
const indent = ref(2)
const error = ref('')

const formatSql = () => {
  if (!sqlInput.value.trim()) {
    sqlOutput.value = ''
    error.value = ''
    return
  }

  try {
    error.value = ''
    sqlOutput.value = format(sqlInput.value, {
      language: dialect.value,
      uppercase: isUppercase.value,
      indent: ' '.repeat(indent.value)
    })
  } catch (e) {
    error.value = t('home.tools.config.error', { e: e.message })
    sqlOutput.value = ''
  }
}

const copySql = () => {
  navigator.clipboard.writeText(sqlOutput.value)
  alert(t('common.copied'))
}

watch([sqlInput, dialect, isUppercase, indent], formatSql, { immediate: true })
</script>

<template>
  <div class="tool-container">
    <div class="back-nav">
      <router-link to="/" class="btn-back">← {{ t('common.backToHome') }}</router-link>
    </div>

    <div class="tool-card">
      <h1 class="title">{{ t('home.tools.sql.title') }}</h1>

      <div class="config-bar">
        <div class="cfg-item">
          <label>{{ t('home.tools.sql.dialect') }}</label>
          <select v-model="dialect">
            <option value="sql">Standard SQL</option>
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="sqlite">SQLite</option>
            <option value="tsql">T-SQL (SQL Server)</option>
          </select>
        </div>

        <div class="cfg-item">
          <label>{{ t('home.tools.sql.indent') }}</label>
          <select v-model.number="indent">
            <option :value="2">2 {{ t('home.tools.password.bits', { n: '' }).replace('位密码', '').replace('bits', '') }} Spacing</option>
            <option :value="4">4 {{ t('home.tools.password.bits', { n: '' }).replace('位密码', '').replace('bits', '') }} Spacing</option>
            <option :value="1">1 Tab</option>
          </select>
        </div>

        <div class="cfg-item">
          <label class="checkbox-label">
            <input type="checkbox" v-model="isUppercase"> {{ t('home.tools.sql.uppercase') }}
          </label>
        </div>
      </div>

      <div class="editor-area">
        <div class="pane">
          <div class="pane-header">
            <label>{{ t('common.input') }} SQL</label>
            <button @click="sqlInput = ''" class="btn-clear-small">{{ t('common.clear') }}</button>
          </div>
          <textarea v-model="sqlInput" :placeholder="t('home.tools.config.placeholder')" spellcheck="false"></textarea>
          <div v-if="error" class="error-msg">{{ error }}</div>
        </div>

        <div class="pane">
          <div class="pane-header">
            <label>{{ t('common.output') }}</label>
            <button v-if="sqlOutput" @click="copySql" class="btn-copy-inline">{{ t('common.copy') }}</button>
          </div>
          <textarea v-model="sqlOutput" readonly :placeholder="t('common.output') + '...'" spellcheck="false"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container { width: 100%; max-width: 1000px; margin: 0 auto; }
.btn-back { text-decoration: none; color: #ff9f43; font-weight: bold; margin-bottom: 20px; display: inline-block; }

.tool-card { background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 30px; }
.title { font-size: 1.5rem; margin: 0 0 25px; color: #2d3436; }

.config-bar { display: flex; gap: 30px; align-items: center; background: #fafafa; padding: 15px 25px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #eee; }
.cfg-item { display: flex; align-items: center; gap: 10px; }
.cfg-item label { font-size: 0.85rem; color: #636e72; font-weight: bold; }
.cfg-item select { padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; background: white; outline: none; cursor: pointer; }

.checkbox-label { display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; font-size: 0.85rem; color: #636e72; }

.editor-area { display: flex; gap: 20px; height: 500px; }
.pane { flex: 1; display: flex; flex-direction: column; position: relative; }
.pane-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.pane-header label { font-size: 0.75rem; color: #b2bec3; font-weight: bold; text-transform: uppercase; }

textarea { flex: 1; border: 1px solid #eee; border-radius: 8px; padding: 15px; font-family: 'Fira Code', monospace; font-size: 0.9rem; background: #fafafa; resize: none; overflow-y: auto; outline: none; line-height: 1.6; }
textarea[readonly] { background: #fdfdfd; }
textarea:focus { border-color: #ff9f43; background: white; }

.btn-clear-small { background: none; border: 1px solid #eee; color: #b2bec3; font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; cursor: pointer; }
.btn-copy-inline { background: #ff9f43; color: white; border: none; padding: 4px 15px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; }

.error-msg { position: absolute; bottom: 15px; left: 15px; right: 15px; background: #fff5f5; color: #d63031; padding: 10px 15px; border-radius: 6px; font-size: 0.8rem; border-left: 4px solid #d63031; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
</style>
