export type Image = {
  id: number
  previewUrl: string | null
  largeUrl: string | null
  name: string
  originalName: string | null
  downloadUrl: string | null
  size: number
  width: number | null
  height: number | null
  capturedAt: string
  createdAt: string
  ownerId: number
  ownerName: string
}
