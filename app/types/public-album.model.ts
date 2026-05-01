export type PublicAlbum = {
  id: number
  name: string | null
  description: string | null
  imagesCount: number
  createdAt: string
  coverImageId: number | null
  coverPreviewUrl: string | null
  ownerId: number
  ownerName: string
  isPublic: boolean
  token: string
}
