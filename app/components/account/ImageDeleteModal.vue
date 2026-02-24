<script setup lang="ts">
import { computed } from 'vue';
import { useImagesDelete } from '~/composables/account/useImagesDelete';
import type { DeleteImagesModalResult } from '~/types/image-delete.contract';

const emit = defineEmits<{ (e: 'close', value: DeleteImagesModalResult): void }>()
const props = defineProps<{ ids: number[] }>()

const { deleteImages, isDeleting } = useImagesDelete()
const count = computed(() => props.ids.length)

function closeModal() {
  emit('close', { action: 'cancel' })
}

async function onConfirm(): Promise<void> {
  const imageDeleteResult = await deleteImages(props.ids)
  emit('close', {
    action: 'confirm',
    deletedIds: imageDeleteResult?.deletedIds ?? [],
  })
}
</script>

<template>
  <UModal :close="{ onClick: closeModal }">
    <template #title>Delete {{ count }} image{{ count === 1 ? '' : 's' }} permanently?</template>

    <template #body>
      This will permanently delete <strong>{{ count }}</strong>
      image{{ count === 1 ? '' : 's' }}.

      <div class="flex gap-3 pt-2">
        <UButton variant="outline" type="button" :disabled="isDeleting" @click="closeModal">
          Cancel
        </UButton>
        <UButton type="button" color="error" :loading="isDeleting" @click="onConfirm">
          <UIcon name="i-heroicons-trash-20-solid" class="mr-2 h-4 w-4" />
          <span v-if="isDeleting">Deleting permanently...</span>
          <span v-else>Delete permanently</span>
        </UButton>
      </div>
    </template>
  </UModal>
</template>
