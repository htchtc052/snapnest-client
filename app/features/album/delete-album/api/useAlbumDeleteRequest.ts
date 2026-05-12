import type { AccountAlbum } from '~/entities/album/model'

export function useAlbumDeleteRequest() {
  const client = useSanctumClient()

  async function deleteAlbumRequest(albumId: AccountAlbum['id']) {
    await client(`/api/account/albums/${albumId}`, {
      method: 'DELETE',
    })
  }

  return {
    deleteAlbumRequest,
  }
}
