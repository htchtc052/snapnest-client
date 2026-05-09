<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits<{
  (e: 'clear'): void
}>()

const props = defineProps<{
  selectedCount: number
}>()

const title = computed(() => {
  if (props.selectedCount === 1) {
    return '1 selected'
  }

  return `${props.selectedCount} selected`
})
</script>

<template>
 <div class="flex items-center justify-between gap-3 rounded-lg bg-muted px-4 py-3 text-highlighted ring ring-default">
    <div class="min-w-0 flex-1">
      <span class="truncate text-base font-medium sm:text-lg">
        {{ title }}
      </span>
    </div>

    <div class="flex shrink-0 items-center gap-1">
      <slot />

      <UButton
        icon="i-heroicons-x-mark-20-solid"
        color="neutral"
        variant="ghost"
        size="sm"
        square
        class="text-white"
        @click="emit('clear')"
      />
    </div>
  </div>
</template>