<script setup lang="ts">
const emit = defineEmits<{
  (e: 'clear'): void
}>()
</script>

<template>
  <div class="flex items-center justify-between gap-3 rounded-lg bg-muted px-4 py-3 text-highlighted ring ring-default">
    <div class="min-w-0 flex-1">
      <slot />
    </div>

    <UButton
      icon="i-heroicons-x-mark-20-solid"
      color="neutral"
      variant="ghost"
      size="sm"
      square
      @click="emit('clear')"
    />
  </div>
</template>