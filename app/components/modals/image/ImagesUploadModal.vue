<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import BaseModal from '~/components/ui/containers/BaseModal.vue'
import type { ImageUploadResponse } from '~/contracts/image-upload.contract'


const emit = defineEmits<{ close: [boolean] }>()

const client = useSanctumClient()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])
const previews = ref<{ name: string; url: string }[]>([])
const errorMessage = ref<string | null>(null)
const isSubmitting = ref(false)

function safeRevokeObjectUrl(url?: string) {
  try { if (url) URL.revokeObjectURL(url) } catch { console.warn('Revoke url failed') }
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? []).filter(f => f.type.startsWith('image/'))

  if (!files.length) {
    errorMessage.value = 'No valid image files selected.'
    return
  }

  for (const file of files) {
    // сначала создаём URL, чтобы при редком исключении индексы не разъехались
    const url = URL.createObjectURL(file)
    selectedFiles.value.push(file)
    previews.value.push({ name: file.name, url })
  }

  errorMessage.value = null
  if (fileInput.value) fileInput.value.value = '' // разрешаем повторный выбор тех же файлов
}

function removeFile(index: number) {
  const p = previews.value[index]
  if (!p) return

  safeRevokeObjectUrl(p.url)
  selectedFiles.value.splice(index, 1)
  previews.value.splice(index, 1)
}

async function handleUpload() {
  if (!selectedFiles.value.length) {
    errorMessage.value = 'No files selected. Please choose files to upload.'
    return
  }

  const fd = new FormData()
  selectedFiles.value.forEach(img => fd.append('images[]', img))

  isSubmitting.value = true
  errorMessage.value = null

  try {
    const res = await client<ImageUploadResponse>('/api/account/images', { method: 'POST', body: fd })
    if (res.failed.length) {
      console.debug('Upload failed:', res.failed)
      errorMessage.value = `${res.failed.length} image(s) failed to upload`
      return
    }

    resetState()
    emit('close', true)
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Upload failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  resetState()
  emit('close', false)
}

function resetState() {
  previews.value.forEach(p => safeRevokeObjectUrl(p.url))
  selectedFiles.value = []
  previews.value = []
  errorMessage.value = null
  if (fileInput.value) fileInput.value.value = ''
}

onBeforeUnmount(resetState)
</script>

<template>
  <BaseModal @close="handleCancel">
    <template #title>Upload images</template>

    <div class="space-y-5">
      <UButton variant="outline" @click="fileInput?.click()">
        <Icon name="i-heroicons-arrow-up-tray-20-solid" class="mr-2" />
        Select images
      </UButton>

      <p class="text-secondary text-sm">
        JPG, JPEG, PNG, WEBP. Must comply with our
        <NuxtLink to="#" class="underline">content policy</NuxtLink>.
      </p>

      <input ref="fileInput" type="file" multiple accept="image/jpeg,image/png,image/webp" class="hidden"
        @change="handleFileSelect">

      <div v-if="previews.length" class="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto">
        <div v-for="(p, i) in previews" :key="p.url">
          <div class="aspect-square overflow-hidden rounded">
            <img :src="p.url" :alt="p.name" class="w-full h-full object-contain">
          </div>
          <div class="mt-2 text-sm truncate">{{ p.name }}</div>
          <UButton color="error" variant="outline" class="mt-2" :disabled="isSubmitting" @click="removeFile(i)">
            <Icon name="i-heroicons-trash-20-solid" class="w-3 h-3" />
          </UButton>
        </div>
      </div>

      <div v-if="errorMessage" class="bg-error-200 px-2 rounded-sm">
        {{ errorMessage }}
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <UButton variant="outline" @click="handleCancel">Cancel</UButton>
        <UButton :loading="isSubmitting" :disabled="!selectedFiles.length || isSubmitting" @click="handleUpload">
          Upload
        </UButton>
      </div>
    </div>
  </BaseModal>
</template>
