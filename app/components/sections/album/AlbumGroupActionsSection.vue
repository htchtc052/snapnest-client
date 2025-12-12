<script setup lang="ts">
import GroupActionsSection from '~/components/sections/blocks/GroupActionsSection.vue'

const props = defineProps<{
  selectedCount: number
  onDelete?: () => void
}>()
</script>

<template>
  <GroupActionsSection :selected-count="props.selectedCount">
    <button type="button"
      class="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
      @click="props.onDelete?.()">
      <Icon name="i-heroicons-trash-20-solid" class="h-4 w-4" />
      Delete
    </button>
  </GroupActionsSection>
</template>
