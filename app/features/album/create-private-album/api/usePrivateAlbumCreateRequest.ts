import type { AccountAlbum, AlbumInfoDto } from '~/entities/album/model'

export function usePrivateAlbumCreateRequest() {
  const client = useSanctumClient()

  async function createPrivateAlbumRequest(data: AlbumInfoDto) {
    return await client<AccountAlbum>('/api/account/albums/private', {
      method: 'POST',
      body: data,
    })
  }

  return {
    createPrivateAlbumRequest,
  }
}
