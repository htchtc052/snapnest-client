export type Image = {
  id: number
  previewUrl?: string
  largeUrl?: string
  name: string
  originalName?: string | null
  capturedAt: string
  createdAt: string
  ownerId: number
  ownerName: string
}
