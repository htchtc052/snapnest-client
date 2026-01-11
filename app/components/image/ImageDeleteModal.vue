<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '~/components/ui/containers/BaseModal.vue'
import { useDeleteImages } from '~/composables/useDeleteImages'
import { useSelectionStore } from '~/composables/useSelection'

const emit = defineEmits<{ (e: 'close', value: { deletedIds: number[]; failedIds: number[] }): void }>()

const { deleteImages, isLoading } = useDeleteImages()
const { selectedIds } = useSelectionStore()
const count = computed(() => selectedIds.value.length)

function closeModal() {
  emit('close', { deletedIds: [], failedIds: [] })
}

async function onConfirm(): Promise<void> {
  const ids = selectedIds.value
  if (!ids.length) {
    emit('close', { deletedIds: [], failedIds: [] })
    return
  }

  const result = await deleteImages(ids)
  emit('close', result)
}
</script>

<template>
  <BaseModal @close="closeModal">
    <template #title>Delete {{ count }} image{{ count === 1 ? '' : 's' }}?</template>

    Are you sure you want to delete
    <strong>{{ count }}</strong>
    image{{ count === 1 ? '' : 's' }}? This action cannot be undone.

    <div class="flex gap-3 pt-2">
      <UButton variant="outline" type="button" :disabled="isLoading" @click="closeModal">
        Cancel
      </UButton>
      <UButton type="button" color="error" :loading="isLoading" @click="onConfirm">
        <UIcon name="i-heroicons-trash-20-solid" class="mr-2 h-4 w-4" />
        Delete
      </UButton>
    </div>
  </BaseModal>
</template>
