<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <USlideover
    title="Uploads"
    side="bottom"
    :modal="false"
    :overlay="false"
    inset
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
