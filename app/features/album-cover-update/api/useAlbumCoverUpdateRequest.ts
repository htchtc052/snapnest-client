import type { AccountAlbum } from '~/entities/album/model'

export function useAlbumCoverUpdateRequest() {
  const client = useSanctumClient()

  async function updateAlbumCoverRequest(albumId: AccountAlbum['id'], coverImageId: number) {
    return await client<AccountAlbum>(`/api/account/albums/${albumId}/cover`, {
      method: 'PUT',
      body: {
        cover_image_id: coverImageId,
      },
    })
  }

  return {
    updateAlbumCoverRequest,
  }
}
