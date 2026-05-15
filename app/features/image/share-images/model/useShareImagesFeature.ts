import { useClipboard } from '@vueuse/core'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { ConfirmForm, type ConfirmResult } from '~/shared/confirm'
import { useOpenModalContent } from '~/shared/modal'
import { useShareImagesRequest } from '../api/useShareImagesRequest'

export function useShareImagesFeature() {
  const config = useRuntimeConfig()
  const toast = useToast()
  const { copy } = useClipboard()
  const openShareConfirm = useOpenModalContent<typeof ConfirmForm, ConfirmResult>({
    component: ConfirmForm,
    title: 'Share selected photos?',
  })
  const { shareImagesRequest } = useShareImagesRequest()

  const {
    execute: executeShareImages,
    isLoading: isSharing,
  } = useApiOperation(shareImagesRequest)

  async function shareImages(ids: number[]) {
    const modalResult = await openShareConfirm({
      description: 'A public album will be created. Anyone with the link will be able to view it.',
      confirmLabel: 'Create public album',
      confirmIcon: 'i-heroicons-link-20-solid',
      confirmColor: 'primary',
    })
    if (!modalResult || modalResult.action === 'cancel') return

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
