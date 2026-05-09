import type { AccountAlbum, AlbumInfoDto } from '~/entities/album/model'

export function useAlbumInfoUpdateRequest() {
  const client = useSanctumClient()

  async function updateAlbumInfoRequest(albumId: number, data: AlbumInfoDto) {
    return await client<AccountAlbum>(`/api/account/albums/${albumId}`, {
      method: 'PUT',
      body: data,
    })
  }

  return {
    updateAlbumInfoRequest,
  }
}
