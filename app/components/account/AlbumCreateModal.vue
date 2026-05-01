<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { reactive, ref } from 'vue'
import { usePrivateAlbumCreateOperation } from '~/composables/features/usePrivateAlbumCreateOperation'
import { albumInfoSchema, type AlbumCreateModalResult, type AlbumInfoDto } from '~/types/album-info.contract'

const emit = defineEmits<{ (e: 'close', value: AlbumCreateModalResult): void }>()

const state = reactive<AlbumInfoDto>({
  name: '',
})
const form = ref<Form<AlbumInfoDto>>()
const { createPrivateAlbum, isCreating } = usePrivateAlbumCreateOperation()

function closeModal() {
  emit('close', { action: 'cancel' })
}

async function onSubmit(e: FormSubmitEvent<AlbumInfoDto>) {
  form.value?.clear()
  const result = await createPrivateAlbum(e.data)
  if (Array.isArray(result)) {
    form.value?.setErrors(result)
    return
  }
  if (result) {
    emit('close', { action: 'confirm', album: result })
  }
}
</script>

<template>
  <UModal :close="{ onClick: closeModal }">
    <template #title>Create album</template>

    <template #body>
      <UForm ref="form" :state="state" :schema="albumInfoSchema" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Album name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <div class="flex gap-3 pt-2">
          <UButton variant="outline" type="button" @click="closeModal">
            Cancel
          </UButton>
          <UButton type="submit" :loading="isCreating">
            Create
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
