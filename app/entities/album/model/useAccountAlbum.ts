import { useAsyncData } from '#imports'
import { useAccountAlbumRequest } from '../api/useAccountAlbumRequest'
import type { AlbumView } from './album.model'

export function useAccountAlbum(albumId: number) {
  const { getAccountAlbum } = useAccountAlbumRequest()

  return useAsyncData<AlbumView>(
    `account-album:${albumId}`,
    () => getAccountAlbum(albumId),
  )
}
