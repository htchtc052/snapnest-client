<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'

import { mapFormError } from '~/http/utils/map-form-error'
import BaseModal from '~/components/modals/base/Modal.vue'
import {
  type AlbumCreateDto,
  albumInfoSchema,
  type AlbumUpdateResult
} from '~/contracts/album-manage.contract'
import { useAlbumCreate } from '~/http/composables/useAlbumCreate'

const props = defineProps<{ imageIds?: number[] }>()
const emit = defineEmits<{ (e: 'close', value: AlbumUpdateResult): void }>()

const initial = computed<AlbumCreateDto>(() => ({
  name: '',
}))

const state = reactive<AlbumCreateDto>({ ...initial.value })
const form = ref<Form<AlbumCreateDto>>()
const isLoading = ref(false)
const statusText = computed(() => {
  if (!isLoading.value) return ''
  return props.imageIds?.length ? 'Creating album and adding images...' : 'Creating album...'
})

function closeModal() {
  emit('close', false)
}

async function onSubmit(e: FormSubmitEvent<AlbumCreateDto>) {
  isLoading.value = true
  form.value?.clear()
  try {
    const updated = await useAlbumCreate({
      ...e.data,
      image_ids: props.imageIds && props.imageIds.length > 0 ? props.imageIds : undefined,
    })
    emit('close', updated)
  } catch (error: unknown) {
    const { isValidationError, bag } = mapFormError(error)
    if (isValidationError) form.value?.setErrors(bag)
    else console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <BaseModal @close="closeModal">
    <template #title> Create new Album</template>
    <template #default>
      <div v-if="statusText" class="mb-2 flex items-center gap-2 text-sm text-gray-600">
        <Icon name="i-heroicons-arrow-path-20-solid" class="h-4 w-4 animate-spin" />
        <span>{{ statusText }}</span>
      </div>

      <UForm ref="form" :state="state" :schema="albumInfoSchema" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Album name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <div class="flex gap-3 pt-2">
          <UButton variant="outline" type="button" @click="closeModal">
            Cancel
          </UButton>
          <UButton type="submit" :loading="isLoading">
            Create album
          </UButton>
        </div>
      </UForm>
    </template>
  </BaseModal>
</template>
