<script setup lang="ts">
import type { ShareImagesConfirmModalResult } from '../contract/share-images.contract'

const emit = defineEmits<{ (e: 'close', value: ShareImagesConfirmModalResult): void }>()

function closeModal() {
  emit('close', { action: 'cancel' })
}

function onConfirm() {
  emit('close', { action: 'confirm' })
}
</script>

<template>
  <UModal :close="{ onClick: closeModal }">
    <template #title>Share selected photos?</template>

    <template #body>
      <div class="space-y-4">
        <p class="text-sm text-muted">
          A public album will be created. Anyone with the link will be able to view it.
        </p>

        <div class="flex gap-3 pt-2">
          <UButton variant="outline" type="button" @click="closeModal">
            Cancel
          </UButton>
          <UButton type="button" color="primary" @click="onConfirm">
            <UIcon name="i-heroicons-link-20-solid" class="mr-2 h-4 w-4" />
            Create public album
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
