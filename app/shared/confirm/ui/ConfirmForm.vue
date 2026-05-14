<script setup lang="ts">
import type { ConfirmFormProps, ConfirmResult } from '../model/confirm'

defineProps<ConfirmFormProps>()

const emit = defineEmits<{
  close: [result: ConfirmResult]
}>()

function cancel() {
  emit('close', { action: 'cancel' })
}

function confirm() {
  emit('close', { action: 'confirm' })
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-muted">
      {{ description }}
    </p>

    <div class="flex gap-3 pt-2">
      <UButton variant="outline" type="button" @click="cancel">
        Cancel
      </UButton>

      <UButton type="button" :color="confirmColor || 'primary'" @click="confirm">
        <UIcon v-if="confirmIcon" :name="confirmIcon" class="mr-2 h-4 w-4" />
        {{ confirmLabel }}
      </UButton>
    </div>
  </div>
</template>
