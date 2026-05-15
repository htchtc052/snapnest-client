import { useOpenModalContent } from '~/shared/modal'
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
