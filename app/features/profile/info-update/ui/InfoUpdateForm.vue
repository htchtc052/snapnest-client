<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import { computed, reactive, ref } from 'vue'
import { profileInfoSchema, type ProfileInfoDto } from '~/entities/user/model'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { User } from '~/entities/user'
import { useInfoUpdateRequest } from '../api/useInfoUpdateRequest'
import type { InfoUpdateFormResult } from '../contract/info-update.contract'

const emit = defineEmits<{ (e: 'close', value?: InfoUpdateFormResult): void }>()
const { user } = useSanctumAuth<User>()

const initial = computed<ProfileInfoDto>(() => ({
  name: user.value?.name ?? '',
}))

const formState = reactive<ProfileInfoDto>({ ...initial.value })
const form = ref<Form<ProfileInfoDto>>()

const { updateInfoRequest } = useInfoUpdateRequest()

const {
  execute: updateInfo,
  isLoading: isUpdating,
} = useApiOperation(updateInfoRequest)

function cancel() {
  emit('close')
}

async function onSubmit(e: FormSubmitEvent<ProfileInfoDto>) {
  form.value?.clear()

  const result = await updateInfo(e.data)

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
  <UForm ref="form" :state="formState" :schema="profileInfoSchema" class="space-y-4" @submit="onSubmit">
    <UFormField name="name" label="Display name">
      <UInput v-model="formState.name" class="w-full" />
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
