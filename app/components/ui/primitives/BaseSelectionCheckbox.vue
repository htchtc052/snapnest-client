<script setup lang="ts">
const props = defineProps<{
  checked: boolean
  disabled?: boolean
  ariaLabel?: string
}>()

const emit = defineEmits<{
  toggle: []
}>()

function onChange() {
  emit('toggle')
}
</script>

<template>
  <label
    class="inline-flex h-6 w-6 items-center justify-center rounded-sm border transition-colors"
    :class="[
      props.checked ? 'border-primary bg-primary text-white' : 'border-black/40 bg-white',
      props.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    ]"
    @click.stop
  >
    <input
      type="checkbox"
      :checked="props.checked"
      :disabled="props.disabled"
      :aria-label="props.ariaLabel"
      class="sr-only"
      @change.stop="onChange"
    >
    <UIcon v-if="props.checked" name="i-heroicons-check-20-solid" class="h-4 w-4" />
  </label>
</template>
