<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
  component: Component
  componentProps?: Record<string, unknown>
  title?: string
}>()

const emit = defineEmits<{
  close: [result?: unknown]
}>()

function close(result?: unknown) {
  emit('close', result)
}
</script>

<template>
  <UModal :close="{ onClick: () => close() }">
    <template v-if="props.title" #title>{{ props.title }}</template>

    <template #body>
      <component
        :is="props.component"
        v-bind="props.componentProps"
        @close="close"
      />
    </template>
  </UModal>
</template>
