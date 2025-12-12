<script setup lang="ts">
import BaseSection from '~/components/sections/base/Section.vue'
const props = defineProps<{
  selectedCount: number
}>()
</script>

<template>
  <BaseSection v-if="props.selectedCount > 0">
    <div
      class="rounded-xl border border-gray-200 bg-white px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex items-center gap-2 text-sm font-medium text-gray-700">
        <UCheckbox :model-value="true" disabled class="rounded bg-white" />
        <span>{{ props.selectedCount }} selected</span>
      </div>

      <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-700">
        <slot />
      </div>
    </div>
  </BaseSection>
</template>
