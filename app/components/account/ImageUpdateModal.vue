<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'
import { useImageUpdateOperation } from '~/composables/features/useImageUpdateOperation'
import { imageUpdateSchema, type ImageUpdateDto, type ImageUpdateModalResult } from '~/types/image-update.contract'
import type { Image } from '~/types/image.model'

const props = defineProps<{ image: Image }>()
const emit = defineEmits<{ (e: 'close', value: ImageUpdateModalResult): void }>()

const initial = computed<ImageUpdateDto>(() => ({
  name: props.image.name ?? '',
}))

const state = reactive<ImageUpdateDto>({ ...initial.value })
const form = ref<Form<ImageUpdateDto>>()
const { updateImage, isUpdating } = useImageUpdateOperation()

function closeModal() {
  emit('close', { action: 'cancel' })
}

async function onSubmit(e: FormSubmitEvent<ImageUpdateDto>) {
  form.value?.clear()
  const result = await updateImage(props.image.id, e.data)
  if (Array.isArray(result)) {
    form.value?.setErrors(result)
    return
  }
  if (result) {
    emit('close', { action: 'confirm', image: result })
  }
}
</script>

<template>
  <UModal :close="{ onClick: closeModal }">
    <template #title> Edit image info</template>
    <template #body>
      <UForm ref="form" :state="state" :schema="imageUpdateSchema" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Image name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <div class="flex gap-3 pt-2">
          <UButton variant="outline" type="button" @click="closeModal">
            Cancel
          </UButton>
          <UButton type="submit" :loading="isUpdating">
            Save changes
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
