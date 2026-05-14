import { useClipboard } from '@vueuse/core'
import type { AccountAlbum } from '~/entities/album/model'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumVisibilityRequest } from '../api/useAlbumVisibilityRequest'

enum AlbumVisibilityAction {
  Publish = 'publish',
  Hide = 'hide',
}

const actionConfig: Record<AlbumVisibilityAction, {
  isPublic: boolean
  successTitle: string
  copyLink: boolean
}> = {
  [AlbumVisibilityAction.Publish]: {
    isPublic: true,
    successTitle: 'Public link created and copied.',
    copyLink: true,
  },
  [AlbumVisibilityAction.Hide]: {
    isPublic: false,
    successTitle: 'Album is now private.',
    copyLink: false,
  },
}

export function useAlbumVisibilityFeature() {
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

  async function executeVisibilityAction(action: AlbumVisibilityAction, album: Pick<AccountAlbum, 'id'>) {
    const actionState = actionConfig[action]
    const updatedAlbum = await setAlbumVisibility(album, actionState.isPublic)
    if (!updatedAlbum) return

    if (actionState.copyLink) {
      await copy(getPublicAlbumUrl(updatedAlbum.token))
    }

    toast.add({
      title: actionState.successTitle,
      color: 'success',
    })

    return updatedAlbum
  }

  function publishAlbum(album: Pick<AccountAlbum, 'id'>) {
    return executeVisibilityAction(AlbumVisibilityAction.Publish, album)
  }

  function hideAlbum(album: Pick<AccountAlbum, 'id'>) {
    return executeVisibilityAction(AlbumVisibilityAction.Hide, album)
  }

  return {
    isUpdatingAlbumVisibility,
    copiedPublicLink: copied,
    publishAlbum,
    hideAlbum,
    copyPublicLink,
  }
}
