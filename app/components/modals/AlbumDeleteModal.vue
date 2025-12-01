<script setup lang="ts">
import { ref } from 'vue'
import {useAlbumDelete} from "~/composables/useAlbumDelete";
import type {Album} from "~/models/Album";

const props = defineProps<{ album: Album }>()
const emit  = defineEmits<{ (e: 'close', value: boolean): void }>()

const isLoading = ref(false)

function closeModal() {
  emit('close', false)
}

async function onConfirm(): Promise<void> {
  isLoading.value = true
  try {
    await useAlbumDelete(props.album.id)
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
    <template #title>Delete album?</template>

    Are you sure you want to delete this album?

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
