<script setup lang="ts">
import { computed } from '#imports'
import type { ImageSelectionAction } from '../model/selectionAction'
import type { ImageSelection } from '../model/useImageSelection'

const props = defineProps<{
  selection: ImageSelection
  actions: ImageSelectionAction[]
}>()

const selectedCountLabel = computed(() => {
  return props.selection.state.selectedCount.value === 1
    ? '1 selected'
    : `${props.selection.state.selectedCount.value} selected`
})

const visibleActions = computed(() => props.actions.filter(action => action.visible !== false))

function selectAction(action: ImageSelectionAction) {
  void action.onSelect()
}
</script>

<template>
  <div class="flex items-center justify-between gap-3 rounded-lg bg-muted px-4 py-3 text-highlighted ring ring-default">
    <div class="flex min-w-0 flex-1 items-center justify-between gap-3">
      <span class="truncate text-base font-medium sm:text-lg">
        {{ selectedCountLabel }}
      </span>

      <div class="flex shrink-0 items-center gap-1">
        <UButton
          v-for="action in visibleActions"
          :key="action.key"
          :icon="action.icon"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          :title="action.title ?? action.label"
          :loading="action.loading"
          :disabled="action.disabled"
          @click="selectAction(action)"
        >
          <span class="hidden sm:inline">{{ action.label }}</span>
        </UButton>
      </div>
    </div>

    <UButton
      icon="i-heroicons-x-mark-20-solid"
      color="neutral"
      variant="ghost"
      size="sm"
      square
      @click="selection.clear"
    />
  </div>
</template>
