<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
  component: Component
  componentProps?: Record<string, unknown>
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
      content: 'sm:left-auto sm:w-full sm:max-w-xl',
    }"
  >
    <template #body>
      <component
        :is="props.component"
        v-bind="props.componentProps"
      />
    </template>
  </UDrawer>
</template>
