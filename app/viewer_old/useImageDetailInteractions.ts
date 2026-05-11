import { computed, navigateTo, ref } from '#imports'
import { onKeyStroke } from '@vueuse/core'
import type { Ref } from 'vue'

type Options = {
  prevTo: Ref<string | null>
  nextTo: Ref<string | null>
}

export function useImageDetailInteractions(options: Options) {
  const isNavigating = ref(false)

  const canGoPrev = computed(() => Boolean(options.prevTo.value))
  const canGoNext = computed(() => Boolean(options.nextTo.value))

  async function goTo(path: string | null) {
    if (!path) return

    isNavigating.value = true

    try {
      await navigateTo(path)
    } finally {
      isNavigating.value = false
    }
  }

  async function goPrev() {
    await goTo(options.prevTo.value)
  }

  async function goNext() {
    await goTo(options.nextTo.value)
  }

  onKeyStroke('ArrowLeft', event => {
    if (!canGoPrev.value) return

    event.preventDefault()
    void goPrev()
  }, { dedupe: true })

  onKeyStroke('ArrowRight', event => {
    if (!canGoNext.value) return

    event.preventDefault()
    void goNext()
  }, { dedupe: true })

  return {
    canGoPrev,
    canGoNext,
    goPrev,
    goNext,
    isNavigating,
  }
}
