<script setup lang="ts">
const props = defineProps<{
  selectedCount: number
}>()
</script>

<template>
  <div
      v-if="props.selectedCount > 0"
      class="mb-4 rounded-xl border border-gray-200 bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
  >
    <div class="flex items-center gap-2 text-sm font-medium text-gray-700">
      <UCheckbox :model-value="true" disabled class="rounded bg-white" />
      <span>{{ props.selectedCount }} selected</span>
    </div>

    <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-700">
      <slot />
    </div>
  </div>
</template>
