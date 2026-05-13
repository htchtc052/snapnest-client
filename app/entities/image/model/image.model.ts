export type ImageDerivativesStatus = 'pending' | 'ready' | 'failed'

export type Image = {
  id: number
  previewUrl?: string
  largeUrl?: string
  name: string
  originalName?: string | null
  derivativesStatus?: ImageDerivativesStatus | null
  downloadUrl?: string | null
  size: number
  width: number | null
  height: number | null
  capturedAt: string
  createdAt: string
  ownerId: number
  ownerName: string
}
