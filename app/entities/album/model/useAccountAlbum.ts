import { useAsyncData } from '#imports'
import { useAccountAlbumRequest } from '../api/useAccountAlbumRequest'
import type { AccountAlbum } from './album.model'

export function useAccountAlbum(albumId: number) {
  const { getAccountAlbum } = useAccountAlbumRequest()

  return useAsyncData<AccountAlbum>(
    `account-album:${albumId}`,
    () => getAccountAlbum(albumId),
  )
}
