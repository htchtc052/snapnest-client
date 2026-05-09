import { useOpenModal } from '~/shared/modal'
import type { User } from '~/types/user.model'
import type { ProfileInfoUpdateModalResult } from '../contract/profile-info-update.contract'
import ProfileInfoUpdateModal from '../ui/ProfileInfoUpdateModal.vue'

export function useProfileInfoUpdate() {
  const { refreshIdentity } = useSanctumAuth<User>()
  const openProfileInfoUpdateModal = useOpenModal<
    typeof ProfileInfoUpdateModal,
    ProfileInfoUpdateModalResult
  >(ProfileInfoUpdateModal)

  async function updateProfileInfo(user: User) {
    const modalResult = await openProfileInfoUpdateModal({ user })

    if (modalResult.action === 'cancel') return

    await refreshIdentity()

    return modalResult.user
  }

  return {
    updateProfileInfo,
  }
}
