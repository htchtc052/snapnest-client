<script setup lang="ts">
import { ref, watch } from '#imports'

const selectedFiles = ref<File[] | null>(null)

watch(selectedFiles, (files) => {
  if (!files?.length) {
    return
  }

  console.log(files)

  selectedFiles.value = null
})
</script>

<template>
  <UFileUpload
    v-model="selectedFiles"
    multiple
    accept="image/*"
    reset
    :dropzone="false"
    :preview="false"
    class="w-full"
  >
    <template #default="{ open }">
      <UButton
        type="button"
        icon="i-heroicons-arrow-up-tray-20-solid"
        color="primary"
        block
        @click="open()"
      >
        Upload images
      </UButton>
    </template>
  </UFileUpload>
</template>
