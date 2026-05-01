<script setup lang="ts">
import { computed } from 'vue'
import type { DeleteImagesModalResult } from '~/types/image-delete.contract'

const emit = defineEmits<{ (e: 'close', value: DeleteImagesModalResult): void }>()
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
    <template #title>Delete {{ count }} image{{ count === 1 ? '' : 's' }} permanently?</template>

    <template #body>
      This will permanently delete <strong>{{ count }}</strong>
      image{{ count === 1 ? '' : 's' }}.

      <div class="flex gap-3 pt-2">
        <UButton variant="outline" type="button" @click="closeModal">
          Cancel
        </UButton>
        <UButton type="button" color="error" @click="onConfirm">
          <UIcon name="i-heroicons-trash-20-solid" class="mr-2 h-4 w-4" />
          Delete permanently
        </UButton>
      </div>
    </template>
  </UModal>
</template>
