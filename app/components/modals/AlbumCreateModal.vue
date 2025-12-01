<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Form, FormSubmitEvent } from '#ui/types'

import { mapFormError } from '~/http/map-form-error'

import {
  type AlbumCreateDto,
  albumInfoSchema,
  type AlbumUpdateResult
} from '~/contracts/album-manage.contract'
import type {Album} from "~/models/Album";
import {useAlbumCreate} from "~/composables/useAlbumCreate";

const emit  = defineEmits<{ (e: 'close', value: AlbumUpdateResult): void }>()

const initial = computed<AlbumCreateDto>(() => ({
  name: '',
  description: '',
}))

const state = reactive<AlbumCreateDto>({ ...initial.value })
const form  = ref<Form<AlbumCreateDto>>()
const isLoading = ref(false)

function closeModal() {
  emit('close', false)
}

async function onSubmit(e: FormSubmitEvent<AlbumCreateDto>) {
  isLoading.value = true
  form.value?.clear()
  try {
    const updated = await useAlbumCreate(e.data)
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
  <AppModal @close="closeModal">
    <template #title> Create new Album</template>
    <template #default>
      <UForm
          ref="form"
          :state="state"
          :schema="albumInfoSchema"
          class="space-y-4"
          @submit="onSubmit"
      >
        <UFormField name="name" label="Album name">
          <UInput v-model="state.name"  class="w-full"
          />
        </UFormField>

        <UFormField name="description" label="Album description">
          <UTextarea v-model="state.description" :rows="4" class="w-full"/>
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
  </AppModal>
</template>

