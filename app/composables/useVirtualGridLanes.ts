import { computed } from '#imports'
import { useElementSize } from '@vueuse/core'

type VirtualGridLanesOptions = {
  min?: number
  max?: number
  targetWidth?: number
}

export function useVirtualGridLanes(
  getElement: () => HTMLElement | null | undefined,
  options: VirtualGridLanesOptions = {}
) {
  const { width } = useElementSize(getElement)
  const min = options.min ?? 2
  const max = options.max ?? 6
  const targetWidth = options.targetWidth ?? 200

  const lanes = computed(() => {
    const raw = Math.floor(width.value / targetWidth)
    return Math.max(min, Math.min(max, raw || min))
  })

  return { lanes }
}
