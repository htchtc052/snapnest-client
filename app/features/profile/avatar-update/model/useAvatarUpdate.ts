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

  async function updateAvatar(user: User) {
    const modalResult = await openAvatarUpdateForm({ user })

    if (modalResult.action === 'cancel') return

    await refreshIdentity()

    return modalResult.user
  }

  return {
    updateAvatar,
  }
}
