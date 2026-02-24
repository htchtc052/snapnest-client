<script setup lang="ts">
import { computed } from 'vue'
import { useImagesTrash } from '~/composables/account/useImagesTrash'
import type { TrashImagesModalResult } from '~/types/image-trash.contract'

const emit = defineEmits<{ (e: 'close', value: TrashImagesModalResult): void }>()
const props = defineProps<{ ids: number[] }>()

const { trashImages, isTrashing } = useImagesTrash()
const count = computed(() => props.ids.length)

function closeModal() {
  emit('close', { action: 'cancel' })
}

async function onConfirm(): Promise<void> {
  const imageTrashResult = await trashImages(props.ids)
  emit('close', {
    action: 'confirm',
    trashedIds: imageTrashResult?.trashedIds ?? [],
  })
}
</script>

<template>
  <UModal :close="{ onClick: closeModal }">
    <template #title>Move {{ count }} image{{ count === 1 ? '' : 's' }} to trash?</template>

    <template #body>
      This will move <strong>{{ count }}</strong> image{{ count === 1 ? '' : 's' }} to trash.

      <div class="flex gap-3 pt-2">
        <UButton variant="outline" type="button" :disabled="isTrashing" @click="closeModal">
          Cancel
        </UButton>
        <UButton type="button" color="error" :loading="isTrashing" @click="onConfirm">
          <UIcon name="i-heroicons-trash-20-solid" class="mr-2 h-4 w-4" />
          <span v-if="isTrashing">Moving...</span>
          <span v-else>Move to trash</span>
        </UButton>
      </div>
    </template>
  </UModal>
</template>
