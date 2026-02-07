<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from '#imports'
import { useUploadsStore } from '~/stores/uploadsStore'
import { UPLOAD_STATUS, UPLOAD_STATUS_COLORS, UPLOAD_STATUS_LABELS } from '~/types/upload-status'

const uploadsStore = useUploadsStore()

const hasItems = computed(() => uploadsStore.items.length > 0)
const isDone = computed(() => uploadsStore.isDone)

const title = computed(() => {
  return isDone.value ? 'Upload completed' : 'Uploading'
})

const remainingCount = computed(() =>
  uploadsStore.items.filter(
    item => item.status === UPLOAD_STATUS.waiting || item.status === UPLOAD_STATUS.uploading,
  ).length,
)
const remainingLabel = computed(() => {
  if (isDone.value || remainingCount.value === 0) return ''
  return remainingCount.value === 1 ? '1 image left' : `${remainingCount.value} images left`
})

const uploadedCount = computed(() =>
  uploadsStore.items.filter(item => item.status === UPLOAD_STATUS.uploaded).length,
)
const uploadedLabel = computed(() => {
  if (!isDone.value || uploadedCount.value === 0) return ''
  return uploadedCount.value === 1 ? '1 image uploaded' : `${uploadedCount.value} images uploaded`
})

const statusLabels = computed(() => UPLOAD_STATUS_LABELS)
const statusColors = computed(() => UPLOAD_STATUS_COLORS)

const previewUrls = new Map<File, string>()
const allFiles = computed(() => uploadsStore.items.map(item => item.file))

function previewFor(file: File) {
  const existing = previewUrls.get(file)
  if (existing) return existing
  const url = URL.createObjectURL(file)
  previewUrls.set(file, url)
  return url
}

watch(allFiles, (files) => {
  const active = new Set(files)
  for (const [file, url] of previewUrls) {
    if (!active.has(file)) {
      URL.revokeObjectURL(url)
      previewUrls.delete(file)
    }
  }
}, { immediate: true })

onBeforeUnmount(() => {
  for (const url of previewUrls.values()) {
    URL.revokeObjectURL(url)
  }
  previewUrls.clear()
})
const userUi = { root: 'min-w-0', wrapper: 'min-w-0', name: 'truncate' }
</script>

<template>
  <UCard
    v-if="hasItems"
    variant="outline"
    class="fixed bottom-4 inset-x-4 z-[70] bg-default shadow-lg sm:inset-x-auto sm:right-4 sm:w-[32rem]"
  >
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm font-semibold text-foreground">{{ title }}</p>
        <span v-if="remainingLabel" class="text-xs text-muted-500">{{ remainingLabel }}</span>
        <span v-else-if="uploadedLabel" class="text-xs text-muted-500">{{ uploadedLabel }}</span>
        <UButton
          icon="i-heroicons-x-mark-20-solid"
          color="neutral"
          variant="ghost"
          size="xs"
          class="shrink-0"
          aria-label="Close uploads"
          @click="uploadsStore.clear"
        />
      </div>
    </template>

    <UScrollArea
      v-slot="{ item }"
      :items="uploadsStore.items"
      :virtualize="{ estimateSize: 64, overscan: 120 }"
      class="h-72 overflow-x-hidden sm:h-80"
      :ui="{ viewport: 'flex flex-col overflow-x-hidden', item: 'min-w-0' }"
    >
      <UPageCard
        :key="item.id"
        variant="ghost"
        class="min-w-0"
        :ui="{ container: 'p-2 gap-2', body: 'p-0' }"
      >
        <template #body>
          <div class="flex min-w-0 items-center gap-3">
            <UUser
              :name="item.file.name"
              :avatar="{ src: previewFor(item.file), alt: item.file.name }"
              size="lg"
              class="min-w-0 flex-1"
              :ui="userUi"
            />
            <UBadge :color="statusColors[item.status]" variant="soft" size="xs" class="ml-auto shrink-0">
              {{ statusLabels[item.status] }}
            </UBadge>
            <UButton
              v-if="item.status === UPLOAD_STATUS.waiting"
              icon="i-heroicons-x-mark-20-solid"
              color="neutral"
              variant="ghost"
              size="xs"
              class="shrink-0"
              aria-label="Remove from queue"
              @click="uploadsStore.removeWaiting(item.id)"
            />
          </div>
        </template>
      </UPageCard>
    </UScrollArea>

  </UCard>
</template>
