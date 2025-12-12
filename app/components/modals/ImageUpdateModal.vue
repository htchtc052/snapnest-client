<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'
import AppModal from "~/components/app/Modal.vue"
import { imageUpdateSchema, type ImageUpdateDto, type ImageUpdateResult } from '~/contracts/image-update.contract'
import { useImageUpdate } from '~/http/composables/useImageUpdate'
import { mapFormError } from '~/http/utils/map-form-error'
import type { Image } from '~/models/Image'

const props = defineProps<{ image: Image }>()
const emit = defineEmits<{ (e: 'close', value: ImageUpdateResult): void }>()

const initial = computed<ImageUpdateDto>(() => ({
  name: props.image.name ?? '',
  description: props.image.description ?? '',
}))

const state = reactive<ImageUpdateDto>({ ...initial.value })
const form = ref<Form<ImageUpdateDto>>()
const isLoading = ref(false)

function closeModal() {
  emit('close', false)
}

async function onSubmit(e: FormSubmitEvent<ImageUpdateDto>) {
  isLoading.value = true
  form.value?.clear()
  try {
    const updated = await useImageUpdate(props.image.id, e.data)
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
    <template #title> Edit image info</template>
    <template #default>
      <UForm ref="form" :state="state" :schema="imageUpdateSchema" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Image name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField name="description" label="Image description">
          <UTextarea v-model="state.description" :rows="4" class="w-full" />
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
  </AppModal>
</template>
