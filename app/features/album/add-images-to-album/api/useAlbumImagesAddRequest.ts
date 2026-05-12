import type { AddImagesToAlbumResult } from '../contract/add-images-to-album.contract'

export function useAlbumImagesAddRequest() {
  const client = useSanctumClient()

  async function addImagesToAlbumRequest(albumId: number, imageIds: number[]) {
    return await client<AddImagesToAlbumResult>(`/api/account/albums/${albumId}/images`, {
      method: 'POST',
      body: { ids: imageIds },
    })
  }

  return {
    addImagesToAlbumRequest,
  }
}
