import { useClipboard } from '@vueuse/core'
import AlbumShareConfirmModal from '~/components/account/AlbumShareConfirmModal.vue'
import { useShareImagesOperation } from '~/composables/features/useShareImagesOperation'
import { useOpenModal } from '~/composables/shared/useOpenModal'
import type { AlbumShareConfirmModalResult } from '~/types/album-share-confirm.contract'

export function useShareImagesFeature() {
  const config = useRuntimeConfig()
  const toast = useToast()
  const { copy } = useClipboard()
  const openShareConfirmModal = useOpenModal<typeof AlbumShareConfirmModal, AlbumShareConfirmModalResult>(AlbumShareConfirmModal)
  const { shareImages: shareImagesOperation, isSharing } = useShareImagesOperation()

  async function shareImages(ids: number[]) {
    const modalResult = await openShareConfirmModal()
    if (modalResult.action === 'cancel') return

    const album = await shareImagesOperation(ids)
    if (!album) return

    await copy(`${config.public.siteUrl}/share/${album.token}`)
    toast.add({ title: 'Created public album and copied link.', color: 'success' })
    await navigateTo(`/account/albums/${album.id}`)
  }

  return {
    isSharing,
    shareImages,
  }
}
