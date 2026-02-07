import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTestPiniaStore = defineStore('testPinia', () => {
  const items = ref<string[]>([])

  function addItem(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return
    items.value = [...items.value, trimmed]
  }

  function removeItem(index: number) {
    items.value = items.value.filter((_, i) => i !== index)
  }

  function clear() {
    items.value = []
  }

  return {
    items,
    addItem,
    removeItem,
    clear,
  }
})
