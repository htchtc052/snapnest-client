<script setup lang="ts">
import { computed, watch } from 'vue'

type BulkActionValue = string

interface BulkActionItem {
  label: string
  value: BulkActionValue
}

const props = defineProps<{
  selectedCount: number
  actions: BulkActionItem[]
  modelValue?: BulkActionValue
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: BulkActionValue | undefined): void
  (e: 'apply'): void
}>()

const value = computed<BulkActionValue | undefined>({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

watch(value, action => {
  if (action && props.selectedCount > 0) {
    emit('apply')
  }
})
</script>

<template>
  <div
      v-if="selectedCount > 0"
      class="mb-4 flex items-center gap-3 text-sm"
  >
    <span>Selected: {{ selectedCount }}</span>

    <USelect
        v-model="value"
        :items="actions"
        placeholder="Choose action"
        class="w-48"
    />

  </div>
</template>
