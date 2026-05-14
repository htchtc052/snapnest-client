import { useAsyncData } from '#imports'
import { usePublicAlbumRequest } from '../api/usePublicAlbumRequest'
import type { PublicAlbum } from './album.model'

export function usePublicAlbum(token: string) {
  const { getPublicAlbum } = usePublicAlbumRequest()

  return useAsyncData<PublicAlbum>(
    `public-album:${token}`,
    () => getPublicAlbum(token),
  )
}
