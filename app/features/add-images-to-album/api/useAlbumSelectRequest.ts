import type { AccountAlbum } from '~/entities/album/model'

export function useAlbumSelectRequest() {
  const client = useSanctumClient()

  async function getSelectableAlbumsRequest() {
    return await client<AccountAlbum[]>('/api/account/albums')
  }

  return {
    getSelectableAlbumsRequest,
  }
}
