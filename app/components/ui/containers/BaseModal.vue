<script setup lang="ts">
const emit = defineEmits<{ close: [unknown?] }>()
</script>

<template>
  <UModal
      :ui="{ content: 'bg-default rounded-lg divide-none px-6 py-4' }"
      :close="{ onClick: () => emit('close', false) }"
  >
    <template #title><slot name="title" /></template>
    <template #body ><slot /></template>
  </UModal>
</template>
