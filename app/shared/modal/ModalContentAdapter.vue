<script setup lang="ts">
import { computed } from '#imports'
import type { Component } from 'vue'

const props = defineProps<{
  component: Component
  componentProps?: Record<string, unknown>
  title?: string
}>()

const emit = defineEmits<{
  close: [result: unknown]
}>()

function close(result: unknown) {
  emit('close', result)
}

const modalTitle = computed(() => {
  if (props.title) return props.title

  const modalTitle = props.componentProps?.modalTitle
  if (typeof modalTitle === 'string') return modalTitle

  const contentTitle = props.componentProps?.title
  return typeof contentTitle === 'string' ? contentTitle : ''
})
</script>

<template>
  <UModal :close="{ onClick: () => close({ action: 'cancel' }) }">
    <template #title>{{ modalTitle }}</template>

    <template #body>
      <component
        :is="props.component"
        v-bind="props.componentProps"
        @close="close"
      />
    </template>
  </UModal>
</template>
