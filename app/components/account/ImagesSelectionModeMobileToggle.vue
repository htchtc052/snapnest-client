<script setup lang="ts">
import { useSelectionStore } from '~/composables/useSelection'

const {
  selectionMode,
  hasSelection,
  enableSelectionMode,
  cancelSelectionMode,
} = useSelectionStore()
</script>

<template>
  <UButton v-if="!selectionMode" variant="outline" @click="enableSelectionMode">
    Select image
  </UButton>
  <UButton v-else-if="!hasSelection" variant="outline" @click="cancelSelectionMode">
    Cancel
  </UButton>
</template>
