import { useOpenModalContent } from '~/shared/modal'
import type { User } from '~/entities/user'
import type { InfoUpdateFormResult } from '../contract/info-update.contract'
import InfoUpdateForm from '../ui/InfoUpdateForm.vue'

export function useInfoUpdate() {
  const { refreshIdentity } = useSanctumAuth<User>()
  const openInfoUpdateForm = useOpenModalContent<
    typeof InfoUpdateForm,
    InfoUpdateFormResult
  >({
    component: InfoUpdateForm,
    title: 'Edit account info',
  })

  async function updateInfo() {
    const updatedUser = await openInfoUpdateForm()

    if (!updatedUser) return

    await refreshIdentity()

    return updatedUser
  }

  return {
    updateInfo,
  }
}
