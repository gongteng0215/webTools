<script setup>
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const updateTitle = (lang) => {
  document.title = lang === 'zh' ? 'Web 实用工具箱' : 'WebTools Dashboard'
}

const changeLang = (lang) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
  updateTitle(lang)
}

onMounted(() => {
  updateTitle(locale.value)
})

watch(locale, (newVal) => {
  updateTitle(newVal)
})
</script>

<template>
  <div class="app-wrapper">
    <div class="lang-switcher">
      <select v-model="locale" @change="changeLang(locale)">
        <option value="en">English</option>
        <option value="zh">中文 (简体)</option>
      </select>
    </div>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
#app-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px 0;
}

.app-wrapper {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f6fa;
  position: relative;
}

.lang-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.lang-switcher select {
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  font-size: 0.85rem;
  color: #636e72;
  cursor: pointer;
  outline: none;
}

.lang-switcher select:hover {
  border-color: #7c4dff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
