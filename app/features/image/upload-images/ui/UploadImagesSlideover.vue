<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <USlideover
    title="Uploads"
    side="right"
    :modal="false"
    :overlay="false"
    :dismissible="false"
    inset
    :ui="{
      content: 'w-full max-w-md',
    }"
  >
    <template #close>
      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        aria-label="Close"
        @click="emit('close')"
      />
    </template>
  </USlideover>
</template>
