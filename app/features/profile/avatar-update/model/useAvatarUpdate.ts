import type { Form } from '#ui/types'
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useOpenModalContent } from '~/shared/modal'
import type { User } from '~/entities/user'
import { useAvatarUpdateRequest } from '../api/useAvatarUpdateRequest'
import type { AvatarUpdateDto } from '../contract/avatar-update.contract'
import AvatarUpdateForm from '../ui/AvatarUpdateForm.vue'

export function useAvatarUpdate() {
  const openAvatarUpdateForm = useOpenModalContent({
    component: AvatarUpdateForm,
    title: 'Change avatar',
  })

  async function updateAvatar() {
    await openAvatarUpdateForm()
  }

  return {
    updateAvatar,
  }
}

export function useAvatarUpdateForm(closeForm: () => void) {
  const { user } = useSanctumAuth<User>()
  const formState = reactive<AvatarUpdateDto>({
    avatar: null,
  })
  const form = ref<Form<AvatarUpdateDto>>()
  const isUpdated = ref(false)
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  const { updateAvatarRequest } = useAvatarUpdateRequest()
  const {
    execute: updateAvatar,
    isLoading: isUpdating,
  } = useApiOperation(updateAvatarRequest)

  const avatarUrl = computed(() => user.value?.avatarUrl ?? undefined)
  const userName = computed(() => user.value?.name ?? '')

  function clearCloseTimer() {
    if (closeTimer === undefined) return

    clearTimeout(closeTimer)
    closeTimer = undefined
  }

  async function handleAvatarUpdate(avatar: File | null | undefined) {
    formState.avatar = avatar ?? null
    form.value?.clear()
    isUpdated.value = false
    clearCloseTimer()

    if (!avatar || isUpdating.value) return

    const result = await updateAvatar(avatar)

    if (result.status === ApiResultStatus.Success) {
      formState.avatar = null
      user.value = result.data
      isUpdated.value = true
      closeTimer = setTimeout(() => {
        closeTimer = undefined
        closeForm()
      }, 1200)

      return
    }

    if (result.status === ApiResultStatus.Validation) {
      isUpdated.value = false
      form.value?.setErrors(result.errors)
    }
  }

  onBeforeUnmount(clearCloseTimer)

  return {
    form,
    formState,
    avatarUrl,
    userName,
    isUpdating,
    isUpdated,
    handleAvatarUpdate,
  }
}
