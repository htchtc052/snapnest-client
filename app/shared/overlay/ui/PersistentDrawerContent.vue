<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
  component: Component
  componentProps?: Record<string, unknown>
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()

function close() {
  emit('close')
}
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
      content: 'sm:left-auto sm:w-full sm:max-w-xl',
    }"
  >
    <template #header>
      <div class="flex w-full items-center justify-between gap-3">
        <h2 class="text-lg font-semibold text-highlighted">
          {{ props.title }}
        </h2>

        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          aria-label="Close"
          @click="close"
        />
      </div>
    </template>

    <template #body>
      <component
        :is="props.component"
        v-bind="props.componentProps"
        @close="close"
      />
    </template>
  </UDrawer>
</template>
