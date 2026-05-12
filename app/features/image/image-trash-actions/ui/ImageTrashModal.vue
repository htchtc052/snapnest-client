<script setup lang="ts">
import { computed } from 'vue'
import type { ImageTrashActionModalResult } from '../contract/image-trash-actions.contract'

const emit = defineEmits<{ (e: 'close', value: ImageTrashActionModalResult): void }>()
const props = defineProps<{ ids: number[] }>()

const count = computed(() => props.ids.length)

function closeModal() {
  emit('close', { action: 'cancel' })
}

function onConfirm(): void {
  emit('close', { action: 'confirm' })
}
</script>

<template>
  <UModal :close="{ onClick: closeModal }">
    <template #title>Move {{ count }} image{{ count === 1 ? '' : 's' }} to trash?</template>

    <template #body>
      This will move <strong>{{ count }}</strong> image{{ count === 1 ? '' : 's' }} to trash.

      <div class="flex gap-3 pt-2">
        <UButton variant="outline" type="button" @click="closeModal">
          Cancel
        </UButton>
        <UButton type="button" color="error" @click="onConfirm">
          <UIcon name="i-heroicons-trash-20-solid" class="mr-2 h-4 w-4" />
          Move to trash
        </UButton>
      </div>
    </template>
  </UModal>
</template>
