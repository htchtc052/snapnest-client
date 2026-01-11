<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'
import BaseModal from '~/components/ui/containers/BaseModal.vue'

import { mapFormError } from '~/http/utils/handle-form-error'

import { albumInfoSchema, type AlbumUpdateDto, type AlbumUpdateResult } from '~/contracts/album-manage.contract'
import { useAlbumUpdate } from '~/http/composables/useAlbumUpdate'
import type { Album } from "~/models/Album"

const props = defineProps<{ album: Album }>()
const emit = defineEmits<{ (e: 'close', value: AlbumUpdateResult): void }>()

const initial = computed<AlbumUpdateDto>(() => ({
  name: props.album.name ?? '',
}))

const state = reactive<AlbumUpdateDto>({ ...initial.value })
const form = ref<Form<AlbumUpdateDto>>()
const isLoading = ref(false)

function closeModal() {
  emit('close', false)
}

async function onSubmit(e: FormSubmitEvent<AlbumUpdateDto>) {
  isLoading.value = true
  form.value?.clear()
  try {
    const updated = await useAlbumUpdate(props.album.id, e.data)
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
    <template #title> Edit album info</template>
    <template #default>
      <UForm ref="form" :state="state" :schema="albumInfoSchema" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Album name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <div class="flex gap-3 pt-2">
          <UButton variant="outline" type="button" @click="closeModal">
            Cancel
          </UButton>
          <UButton type="submit" :loading="isLoading">
            Save changes
          </UButton>
        </div>
      </UForm>
    </template>
  </BaseModal>
</template>
