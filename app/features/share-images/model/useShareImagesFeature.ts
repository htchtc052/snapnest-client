import { useClipboard } from '@vueuse/core'
import { useOpenModal } from '~/shared/modal'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useShareImagesRequest } from '../api/useShareImagesRequest'
import type { ShareImagesConfirmModalResult } from '../contract/share-images.contract'
import ShareImagesConfirmModal from '../ui/ShareImagesConfirmModal.vue'

export function useShareImagesFeature() {
  const config = useRuntimeConfig()
  const toast = useToast()
  const { copy } = useClipboard()
  const openShareConfirmModal = useOpenModal<
    typeof ShareImagesConfirmModal,
    ShareImagesConfirmModalResult
  >(ShareImagesConfirmModal)
  const { shareImagesRequest } = useShareImagesRequest()

  const {
    execute: executeShareImages,
    isLoading: isSharing,
  } = useApiOperation(shareImagesRequest)

  async function shareImages(ids: number[]) {
    const modalResult = await openShareConfirmModal()
    if (modalResult.action === 'cancel') return

    const result = await executeShareImages(ids)
    if (result.status !== ApiResultStatus.Success) return

    const album = result.data

    await copy(`${config.public.siteUrl}/share/${album.token}`)
    toast.add({ title: 'Created public album and copied link.', color: 'success' })
    await navigateTo(`/account/albums/${album.id}`)
  }

  return {
    isSharing,
    shareImages,
  }
}
