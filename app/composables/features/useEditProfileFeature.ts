import ProfileEditModal from '~/components/account/ProfileEditModal.vue'
import { useOpenModal } from '~/composables/shared/useOpenModal'
import type { User } from '~/types/user.model'

export function useEditProfileFeature() {
  const { refreshIdentity } = useSanctumAuth<User>()
  const openEditProfileModal = useOpenModal<typeof ProfileEditModal, boolean>(ProfileEditModal)

  async function editProfile(user: User) {
    const isUpdated = await openEditProfileModal({ user })
    if (isUpdated) {
      await refreshIdentity()
    }

    return isUpdated
  }

  return {
    editProfile,
  }
}
