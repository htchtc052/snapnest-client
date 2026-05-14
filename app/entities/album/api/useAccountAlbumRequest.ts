import type { AlbumView } from '../model'

export function useAccountAlbumRequest() {
  const client = useSanctumClient()

  function getAccountAlbum(albumId: number): Promise<AlbumView> {
    return client<AlbumView>(`/api/account/albums/${albumId}`)
  }

  return {
    getAccountAlbum,
  }
}
