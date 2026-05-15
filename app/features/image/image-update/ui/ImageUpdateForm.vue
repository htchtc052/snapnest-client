<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { Image } from '~/entities/image'
import { useImageUpdateRequest } from '../api/useImageUpdateRequest'
import {
  imageUpdateSchema,
  type ImageUpdateDto,
  type ImageUpdateFormResult,
} from '../contract/image-update.contract'

const props = defineProps<{ image: Image }>()
const emit = defineEmits<{ (e: 'close', value?: ImageUpdateFormResult): void }>()

const initial = computed<ImageUpdateDto>(() => ({
  name: props.image.name ?? '',
}))

const state = reactive<ImageUpdateDto>({ ...initial.value })
const form = ref<Form<ImageUpdateDto>>()
const { updateImageRequest } = useImageUpdateRequest()

const {
  execute: updateImage,
  isLoading: isUpdating,
} = useApiOperation(updateImageRequest)

function cancel() {
  emit('close')
}

async function onSubmit(e: FormSubmitEvent<ImageUpdateDto>) {
  form.value?.clear()

  const result = await updateImage(props.image.id, e.data)

  if (result.status === ApiResultStatus.Success) {
    emit('close', result.data)
    return
  }

  if (result.status === ApiResultStatus.Validation) {
    form.value?.setErrors(result.errors)
  }
}
</script>

<template>
  <UForm ref="form" :state="state" :schema="imageUpdateSchema" class="space-y-4" @submit="onSubmit">
    <UFormField name="name" label="Image name">
      <UInput v-model="state.name" class="w-full" />
    </UFormField>

    <div class="flex gap-3 pt-2">
      <UButton variant="outline" type="button" @click="cancel">
        Cancel
      </UButton>
      <UButton type="submit" :loading="isUpdating">
        Save changes
      </UButton>
    </div>
  </UForm>
</template>
