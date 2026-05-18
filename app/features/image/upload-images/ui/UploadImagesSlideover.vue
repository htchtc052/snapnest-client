<script setup lang="ts">
import { computed } from '#imports'
import { useWindowSize } from '@vueuse/core'

const emit = defineEmits<{
  close: []
}>()

const { width } = useWindowSize()
const drawerDirection = computed(() => width.value < 768 ? 'bottom' : 'right')
const drawerUi = computed(() => ({
  content: drawerDirection.value === 'bottom'
    ? 'h-[72dvh]'
    : 'w-full max-w-md',
  container: 'gap-0 p-0',
  header: 'flex h-20 items-center justify-between border-b border-default px-6',
  body: 'min-h-0 flex-1',
}))
</script>

<template>
  <UDrawer
    :direction="drawerDirection"
    :modal="false"
    :overlay="false"
    :dismissible="false"
    :handle="drawerDirection === 'bottom'"
    inset
    :ui="drawerUi"
  >
    <template #header>
      <h2 class="text-lg font-semibold text-highlighted">
        Uploads
      </h2>

      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        aria-label="Close"
        @click="emit('close')"
      />
    </template>
  </UDrawer>
</template>
