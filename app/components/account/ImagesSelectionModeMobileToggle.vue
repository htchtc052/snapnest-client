<script setup lang="ts">
import { useSelectionStore } from '~/composables/useSelection';

const {
  selectionMode,
  hasSelection,
  enableSelectionMode,
  cancelSelectionMode,
} = useSelectionStore()
</script>

<template>
  <UButton v-if="!selectionMode" class="sm:hidden" variant="outline" @click="enableSelectionMode">
    Select image
  </UButton>
  <UButton v-else-if="!hasSelection" class="sm:hidden" variant="outline" @click="cancelSelectionMode">
    Cancel
  </UButton>
</template>
