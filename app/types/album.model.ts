import type { Image } from '~/types/image.model'

export type Album = {
  id: number
  name: string
  description: string | null
  imagesCount?: number
  coverPreviewUrl: string | null
  isPublic?: boolean
  isOwner?: boolean
  publicToken?: string | null
  ownerId: number
  ownerName: string
  createdAt: string
  images?: Image[]
}
