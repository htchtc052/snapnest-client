<script setup lang="ts">
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

    <UButton
        size="xs"
        @click="emit('apply')"
    >
      Apply
    </UButton>
  </div>
</template>
