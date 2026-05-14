import { useOpenModalContent } from '~/shared/modal'
import type { User } from '~/entities/user'
import type { ProfileAvatarUpdateFormResult } from '../contract/profile-avatar-update.contract'
import ProfileAvatarUpdateForm from '../ui/ProfileAvatarUpdateForm.vue'

export function useProfileAvatarUpdate() {
  const { refreshIdentity } = useSanctumAuth<User>()
  const openProfileAvatarUpdateForm = useOpenModalContent<
    typeof ProfileAvatarUpdateForm,
    ProfileAvatarUpdateFormResult
  >({
    component: ProfileAvatarUpdateForm,
    title: 'Change avatar',
  })

  async function updateProfileAvatar(user: User) {
    const modalResult = await openProfileAvatarUpdateForm({ user })

    if (modalResult.action === 'cancel') return

    await refreshIdentity()

    return modalResult.user
  }

  return {
    updateProfileAvatar,
  }
}
