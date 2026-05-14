export type AlbumAccessContext = {
  isOwner: boolean
}

export type AlbumHeaderPolicy = {
  canViewOwnerName: boolean
  canViewCreatedAt: boolean
  canViewImagesCount: boolean
}

export function getAlbumHeaderPolicy(context: AlbumAccessContext): AlbumHeaderPolicy {
  return {
    canViewOwnerName: context.isOwner,
    canViewCreatedAt: context.isOwner,
    canViewImagesCount: true,
  }
}
