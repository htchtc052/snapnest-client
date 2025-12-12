<script setup lang="ts">
import { computed, ref } from 'vue';
import BaseModal from '~/components/modals/base/Modal.vue'
import { useImageDelete } from '~/http/composables/useImageDelete';

const props = defineProps<{ imageIds: number[] }>()
const emit = defineEmits<{ (e: 'close', value: boolean): void }>()

const isLoading = ref(false)
const count = computed(() => props.imageIds.length)

function closeModal() {
  emit('close', false)
}

async function onConfirm(): Promise<void> {
  if (!props.imageIds.length) {
    emit('close', false)
    return
  }

  isLoading.value = true
  try {
    await Promise.all(props.imageIds.map(id => useImageDelete(id)))
    emit('close', true)
  } catch (error) {
    console.error('[Images] Failed to delete selected images', error)
    emit('close', false)
  } finally {
    isLoading.value = false
  }
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
        <Icon name="i-heroicons-trash-20-solid" class="mr-2 w-4 h-4" />
        Delete
      </UButton>
    </div>
  </BaseModal>
</template>
