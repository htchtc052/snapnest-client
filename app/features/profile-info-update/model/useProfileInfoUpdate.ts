import { useOpenModalContent } from '~/shared/modal'
import type { User } from '~/entities/user'
import type { ProfileInfoUpdateFormResult } from '../contract/profile-info-update.contract'
import ProfileInfoUpdateForm from '../ui/ProfileInfoUpdateForm.vue'

export function useProfileInfoUpdate() {
  const { refreshIdentity } = useSanctumAuth<User>()
  const openProfileInfoUpdateForm = useOpenModalContent<typeof ProfileInfoUpdateForm, ProfileInfoUpdateFormResult>({
    component: ProfileInfoUpdateForm,
    title: 'Edit account info',
  })

  async function updateProfileInfo(user: User) {
    const modalResult = await openProfileInfoUpdateForm({ user })

    if (modalResult.action === 'cancel') return

    await refreshIdentity()

    return modalResult.user
  }

  return {
    updateProfileInfo,
  }
}
