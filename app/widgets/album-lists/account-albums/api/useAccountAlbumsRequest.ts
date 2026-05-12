import type { AccountAlbum } from '~/entities/album/model'

export function useAccountAlbumsRequest() {
  const client = useSanctumClient()

  function getAccountAlbums(): Promise<AccountAlbum[]> {
    return client<AccountAlbum[]>('/api/account/albums')
  }

  return {
    getAccountAlbums,
  }
}
