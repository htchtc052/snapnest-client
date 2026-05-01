import { useClipboard } from '@vueuse/core'
import type { AccountAlbum } from '~/types/account-album.model'
import { useAlbumVisibilityOperation } from '~/composables/features/useAlbumVisibilityOperation'

export function useAlbumVisibilityFeature() {
  const config = useRuntimeConfig()
  const toast = useToast()
  const { copy, copied } = useClipboard()
  const { isUpdatingVisibility, updateAlbumVisibility } = useAlbumVisibilityOperation()

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

  async function publishAlbum(album: Pick<AccountAlbum, 'id'>) {
    const updatedAlbum = await updateAlbumVisibility(album.id, true)
    if (!updatedAlbum) return

    await copy(getPublicAlbumUrl(updatedAlbum.token))
    toast.add({
      title: 'Public link created and copied.',
      color: 'success',
    })

    return updatedAlbum
  }

  async function hideAlbum(album: Pick<AccountAlbum, 'id'>) {
    const updatedAlbum = await updateAlbumVisibility(album.id, false)
    if (!updatedAlbum) return

    toast.add({
      title: 'Album is now private.',
      color: 'success',
    })

    return updatedAlbum
  }

  return {
    isUpdatingAlbumVisibility: isUpdatingVisibility,
    copiedPublicLink: copied,
    publishAlbum,
    hideAlbum,
    copyPublicLink,
  }
}