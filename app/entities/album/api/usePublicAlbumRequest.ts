import type { PublicAlbum } from '~/types/public-album.model'

export function usePublicAlbumRequest() {
  const client = useSanctumClient()

  function getPublicAlbum(token: string): Promise<PublicAlbum> {
    return client<PublicAlbum>(`/api/albums/${token}`)
  }

  return {
    getPublicAlbum,
  }
}
