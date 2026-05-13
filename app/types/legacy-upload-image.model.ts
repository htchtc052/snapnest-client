export type LegacyUploadImage = {
  id: number
  previewUrl?: string
  largeUrl?: string
  name: string
  originalName?: string | null
  derivativesStatus?: 'pending' | 'ready' | 'failed' | null
  downloadUrl?: string | null
  size: number
  width: number | null
  height: number | null
  capturedAt: string
  createdAt: string
  ownerId: number
  ownerName: string
}
