import type { Album } from './album.model'

export type AlbumPolicyActor = {
  id: number
} | null | undefined

export type AlbumPolicy = {
  canEditAlbum: boolean
  canDownloadAlbum: boolean
}

export function createAlbumPolicy(actor: AlbumPolicyActor, album: Album): AlbumPolicy {
  const isOwner = actor?.id === album.ownerId

  return {
    canEditAlbum: isOwner,
    canDownloadAlbum: isOwner,
  }
}
