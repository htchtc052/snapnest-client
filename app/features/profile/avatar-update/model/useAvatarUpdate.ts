import { useOpenModalContent } from '~/shared/modal'
import type { User } from '~/entities/user'
import type { AvatarUpdateFormResult } from '../contract/avatar-update.contract'
import AvatarUpdateForm from '../ui/AvatarUpdateForm.vue'

export function useAvatarUpdate() {
  const { refreshIdentity } = useSanctumAuth<User>()
  const openAvatarUpdateForm = useOpenModalContent<
    typeof AvatarUpdateForm,
    AvatarUpdateFormResult
  >({
    component: AvatarUpdateForm,
    title: 'Change avatar',
  })

  async function updateAvatar() {
    const updatedUser = await openAvatarUpdateForm()

    if (!updatedUser) return

    await refreshIdentity()

    return updatedUser
  }

  return {
    updateAvatar,
  }
}
