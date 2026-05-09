import type { AccountAlbum } from '~/entities/album/model'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumCoverUpdateRequest } from '../api/useAlbumCoverUpdateRequest'

export function useAlbumCoverUpdate() {
  const toast = useToast()
  const { updateAlbumCoverRequest } = useAlbumCoverUpdateRequest()

  const {
    execute: executeAlbumCoverUpdate,
    isLoading: isUpdatingAlbumCover,
  } = useApiOperation(updateAlbumCoverRequest)

  async function setAlbumCover(album: AccountAlbum, imageId: number) {
    const result = await executeAlbumCoverUpdate(album.id, imageId)
    if (result.status !== ApiResultStatus.Success) return

    toast.add({
      title: 'Album cover updated.',
      color: 'success',
    })

    return result.data
  }

  return {
    isUpdatingAlbumCover,
    setAlbumCover,
  }
}
