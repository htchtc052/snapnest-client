<script setup lang="ts">
import { computed } from '#imports'
//import ImageDetailShell from '~/components/widgets/ImageDetailShell.vue'
import type { ImageDetailContext } from '~/types/image-detail-context.model'

const props = withDefaults(defineProps<{
  open: boolean
  detail: ImageDetailContext | null
  isLoading?: boolean
  loadError: unknown | null
  prevTo?: string | null
  nextTo?: string | null
}>(), {
  isLoading: false,
  prevTo: null,
  nextTo: null,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: value => {
    if (!value) {
      emit('close')
    }
  },
})
</script>

<template>
  <UModal
    v-model:open="isOpen"
    fullscreen
    :ui="{
      overlay: 'bg-black/90',
      content: 'fixed inset-0 h-dvh max-h-dvh overflow-hidden bg-black text-white divide-none',
      header: 'flex shrink-0 justify-end px-2 pb-0 pt-2 sm:px-3 sm:pt-3 min-h-0',
      wrapper: 'hidden',
      body: 'flex-1 min-h-0 overflow-hidden p-0',
      close: 'static'
    }"
  >
    <template #close>
      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        size="xl"
        square
        class="text-white"
        aria-label="Close viewer"
      />
    </template>

    <template #body>
    <!--   <ImageDetailShell
        v-if="props.detail"
        :image="props.detail.image"
        :is-loading="props.isLoading"
        :prev-to="props.prevTo"
        :next-to="props.nextTo"
      >
        <template #actions>
          <slot name="actions" />
        </template>
      </ImageDetailShell> 

      <div
        v-else
        class="flex h-full items-center justify-center bg-black text-white"
      >
        <UEmpty
          v-if="props.loadError"
          description="Unable to load image"
          size="md"
          variant="naked"
        />

        <UIcon
          v-else
          name="i-heroicons-arrow-path-20-solid"
          class="h-8 w-8 animate-spin text-highlighted"
        />

      </div>-->
    </template>
  </UModal>
</template>
