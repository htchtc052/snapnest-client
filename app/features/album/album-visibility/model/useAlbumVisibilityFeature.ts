import { useClipboard } from '@vueuse/core'
import type { AccountAlbum } from '~/entities/album/model'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumVisibilityRequest } from '../api/useAlbumVisibilityRequest'

type UseAlbumVisibilityFeatureOptions = {
  onUpdated?: (album: AccountAlbum) => void
}

export function useAlbumVisibilityFeature(options: UseAlbumVisibilityFeatureOptions = {}) {
  const config = useRuntimeConfig()
  const toast = useToast()
  const { copy, copied } = useClipboard()
  const { updateAlbumVisibilityRequest } = useAlbumVisibilityRequest()

  const {
    execute: updateAlbumVisibility,
    isLoading: isUpdatingAlbumVisibility,
  } = useApiOperation(updateAlbumVisibilityRequest)

  function getPublicAlbumUrl(token: string) {
    return `${config.public.siteUrl}/share/${token}`
  }

  async function copyPublicLink(album: Pick<AccountAlbum, 'token'>) {
    await copy(getPublicAlbumUrl(album.token))
    toast.add({
      title: 'Public link copied.',
      color: 'success',
    })
  }

  async function setAlbumVisibility(album: Pick<AccountAlbum, 'id'>, isPublic: boolean) {
    const result = await updateAlbumVisibility(album.id, isPublic)
    if (result.status !== ApiResultStatus.Success) return

    return result.data
  }

  async function publishAlbum(album: Pick<AccountAlbum, 'id'>) {
    const updatedAlbum = await setAlbumVisibility(album, true)
    if (!updatedAlbum) return

    await copy(getPublicAlbumUrl(updatedAlbum.token))
    toast.add({
      title: 'Public link created and copied.',
      color: 'success',
    })

    options.onUpdated?.(updatedAlbum)

    return updatedAlbum
  }

  async function hideAlbum(album: Pick<AccountAlbum, 'id'>) {
    const updatedAlbum = await setAlbumVisibility(album, false)
    if (!updatedAlbum) return

    toast.add({
      title: 'Album is now private.',
      color: 'success',
    })

    options.onUpdated?.(updatedAlbum)

    return updatedAlbum
  }

  return {
    isUpdatingAlbumVisibility,
    copiedPublicLink: copied,
    publishAlbum,
    hideAlbum,
    copyPublicLink,
  }
}
