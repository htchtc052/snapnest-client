<script setup lang="ts">
import { computed, ref } from 'vue'
import AppModal from '~/components/app/Modal.vue'
import { useAlbumDelete } from '~/composables/useAlbumDelete'

const props = defineProps<{ albumIds: number[] }>()
const emit = defineEmits<{ (e: 'close', value: boolean): void }>()

const isLoading = ref(false)
const count = computed(() => props.albumIds.length)

function closeModal() {
  emit('close', false)
}

async function onConfirm(): Promise<void> {
  if (!props.albumIds.length) {
    emit('close', false)
    return
  }

  isLoading.value = true
  try {
    await Promise.all(props.albumIds.map(id => useAlbumDelete(id)))
    emit('close', true)
  } catch (error) {
    console.error('[Albums] Failed to delete selected albums', error)
    emit('close', false)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AppModal @close="closeModal">
    <template #title>Delete {{ count }} album{{ count === 1 ? '' : 's' }}?</template>

    Are you sure you want to delete
    <strong>{{ count }}</strong>
    album{{ count === 1 ? '' : 's' }}?

    <div class="flex gap-3 pt-2">
      <UButton variant="outline" type="button" :disabled="isLoading" @click="closeModal">
        Cancel
      </UButton>
      <UButton type="button" color="error" :loading="isLoading" @click="onConfirm">
        <Icon name="i-heroicons-trash-20-solid" class="mr-2 w-4 h-4" />
        Delete
      </UButton>
    </div>
  </AppModal>
</template>
