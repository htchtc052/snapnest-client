<script setup lang="ts">
import { computed } from 'vue'
import ImageDeleteModal from '~/components/image/ImageDeleteModal.vue'
import { useOpenModal } from '~/composables/useOpenModal'
import { useSelectionStore } from '~/composables/useSelection'

const emit = defineEmits<{ (e: 'deleted', ids: number[]): void }>()
const { selectedIds, selectedImagesData, clearSelection, deselectIds } = useSelectionStore()
const openDeleteModal = useOpenModal<typeof ImageDeleteModal, { deletedIds: number[]; failedIds: number[] }>(ImageDeleteModal)

const selectedCount = computed(() => selectedIds.value.length)
const showClearToggle = computed(() => selectedCount.value > 1)
const selectionLabel = computed(() => {
  if (selectedCount.value === 1) {
    const selectedId = selectedIds.value[0]
    return selectedId ? selectedImagesData.value[selectedId]?.name ?? '1 selected' : '1 selected'
  }
  return `${selectedCount.value} selected`
})

async function confirmDelete() {
  const ids = selectedIds.value
  if (!ids.length) return
  const result = await openDeleteModal()
  if (!result?.deletedIds.length) return
  deselectIds(result.deletedIds)
  emit('deleted', result.deletedIds)
}

function addToAlbum() {
  const ids = selectedIds.value
  if (!ids.length) return
  console.info('[Images] Add to album:', ids)
}
</script>

<template>
  <div class="rounded-full bg-blue-700 px-4 py-2 text-white shadow-md">
    <div class="flex items-center justify-between gap-4">
      <div class="flex min-w-0 items-center gap-3">
        <UCheckbox
          v-if="showClearToggle"
          :model-value="true"
          color="primary"
          @click.stop
          @update:model-value="clearSelection"
        />
        <div class="truncate text-sm font-semibold">
          {{ selectionLabel }}
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          icon="i-heroicons-folder-plus-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white hover:bg-white/15"
          @click="addToAlbum"
        />
        <UButton
          icon="i-heroicons-trash-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white hover:bg-white/15"
          @click="confirmDelete"
        />
        <UButton
          icon="i-heroicons-x-mark-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          class="text-white hover:bg-white/15"
          @click="clearSelection"
        />
      </div>
    </div>
  </div>
</template>
