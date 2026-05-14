import type { AccountAlbum } from '../model'

export function useAccountAlbumRequest() {
  const client = useSanctumClient()

  function getAccountAlbum(albumId: number): Promise<AccountAlbum> {
    return client<AccountAlbum>(`/api/account/albums/${albumId}`)
  }

  return {
    getAccountAlbum,
  }
}
