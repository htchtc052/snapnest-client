import { computed, useLazyAsyncData } from '#imports'
import type { AccountAlbum } from '~/entities/album/model'
import { useAccountAlbumsRequest } from '../api/useAccountAlbumsRequest'

export function useAccountAlbums() {
  const { getAccountAlbums } = useAccountAlbumsRequest()

  const {
    data: albums,
    status,
    refresh,
  } = useLazyAsyncData<AccountAlbum[]>(
    'account-albums',
    getAccountAlbums,
    {
      default: () => [],
    },
  )

  const isLoading = computed(() => status.value === 'pending')
  const hasLoadError = computed(() => status.value === 'error')
  const isEmpty = computed(() => {
    return !isLoading.value
      && !hasLoadError.value
      && albums.value.length === 0
  })

  function replaceAlbum(updatedAlbum: AccountAlbum) {
    const albumIndex = albums.value.findIndex(album => album.id === updatedAlbum.id)
    if (albumIndex === -1) return

    albums.value.splice(albumIndex, 1, updatedAlbum)
  }

  function removeAlbumById(albumId: AccountAlbum['id']) {
    const albumIndex = albums.value.findIndex(album => album.id === albumId)
    if (albumIndex === -1) return

    albums.value.splice(albumIndex, 1)
  }

  return {
    albums,

    isLoading,
    hasLoadError,
    isEmpty,

    refresh,
    replaceAlbum,
    removeAlbumById,
  }
}
