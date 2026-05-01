import ImageUpdateModal from '~/components/account/ImageUpdateModal.vue'
import { imageStatusGet } from '~/api/account/imageStatusGet'
import { useOpenModal } from '~/composables/shared/useOpenModal'
import type { ImageUpdateModalResult } from '~/types/image-update.contract'

export function useRenameImageFeature() {
  const client = useSanctumClient()
  const openUpdateModal = useOpenModal<typeof ImageUpdateModal, ImageUpdateModalResult>(ImageUpdateModal)

  async function renameImage(imageId: number) {
    const image = await imageStatusGet(client, imageId)
    const modalResult = await openUpdateModal({ image })
    if (!modalResult || modalResult.action === 'cancel') return

    return modalResult.image
  }

  return {
    renameImage,
  }
}
