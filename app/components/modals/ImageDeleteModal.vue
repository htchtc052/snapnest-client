<script setup lang="ts">
import { ref } from 'vue'
import type { Image } from '~/models/Image'
import { useImageDelete } from '~/composables/useImageDelete'

const props = defineProps<{ image: Image }>()
const emit  = defineEmits<{ (e: 'close', value: boolean): void }>()

const isLoading = ref(false)

function closeModal() {
  emit('close', false)
}

async function onConfirm(): Promise<void> {
  isLoading.value = true
  try {
    await useImageDelete(props.image.id)
    emit('close', true)
  } catch (error) {
    console.error(error)
    emit('close', false)
  } finally {
    isLoading.value = false
  }
}
</script>


<template>
  <AppModal @close="closeModal">
    <template #title>Delete image?</template>

    Are you sure you want to delete this image?

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
