import type { AccountAlbum } from '~/types/account-album.model'
import { useAlbumCoverOperation } from '~/composables/features/useAlbumCoverOperation'

export function useAlbumCoverFeature() {
  const { isUpdatingCover, updateAlbumCover } = useAlbumCoverOperation()

  async function setAlbumCover(album: AccountAlbum, imageId: number) {
    return await updateAlbumCover(album.id, imageId)
  }

  return {
    isUpdatingAlbumCover: isUpdatingCover,
    setAlbumCover,
  }
}
