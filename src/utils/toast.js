import { ref } from 'vue'

const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimer

const showToast = (message, duration = 2000) => {
  clearTimeout(toastTimer)
  toastMessage.value = message
  toastVisible.value = true
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, duration)
}

export { toastMessage, toastVisible, showToast }
