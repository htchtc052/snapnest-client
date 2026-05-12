import type { RemoveImagesFromAlbumResult } from '../contract/remove-images-from-album.contract'

export function useAlbumImagesRemoveRequest() {
  const client = useSanctumClient()

  async function removeImagesFromAlbumRequest(albumId: number, imageIds: number[]) {
    return await client<RemoveImagesFromAlbumResult>(`/api/account/albums/${albumId}/images`, {
      method: 'DELETE',
      body: { ids: imageIds },
    })
  }

  return {
    removeImagesFromAlbumRequest,
  }
}
