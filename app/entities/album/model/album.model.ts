export type Album = {
  id: number
  name: string | null
  description: string | null
  imagesCount: number
  coverImageId: number | null
  coverPreviewUrl: string | null
  isPublic: boolean
  token: string
  ownerId: number
  ownerName: string
  createdAt: string
}

export type AccountAlbum = Album

export type PublicAlbum = Album
