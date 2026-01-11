<script setup lang="ts">
import BaseSelectionCheckbox from '~/components/ui/primitives/BaseSelectionCheckbox.vue'

const props = defineProps<{
  checked: boolean
  disabled?: boolean
  ariaLabel?: string
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <BaseSelectionCheckbox
    :checked="props.checked"
    :disabled="props.disabled"
    :aria-label="props.ariaLabel"
    @toggle="emit('toggle')"
  />
</template>
