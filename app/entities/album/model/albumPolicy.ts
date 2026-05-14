import type { Album } from './album.model'

export type AlbumPolicyActor = {
  id: number
} | null | undefined

export type AlbumPolicy = {
  isOwner: boolean
  canDownloadAlbum: boolean
}

export function getAlbumPolicy(actor: AlbumPolicyActor, album: Album): AlbumPolicy {
  const isOwner = actor?.id === album.ownerId

  return {
    isOwner,
    canDownloadAlbum: isOwner,
  }
}
