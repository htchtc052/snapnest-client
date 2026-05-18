<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <UDrawer
    direction="bottom"
    :modal="false"
    :overlay="false"
    :dismissible="false"
    :handle="false"
    inset
    :ui="{
      content: 'left-auto w-full max-w-xl',
      header: 'flex items-center justify-between gap-3',
    }"
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
