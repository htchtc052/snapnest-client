export type User = {
  id: number
  name: string
  email: string
  bio?: string | null
  birthDate?: string | null
  createdAt: string
  avatarUrl?: string | null
  plan?: 'free' | 'premium'
  imagesUsed?: number
  bytesUsed?: number
  maxImages?: number
  maxTotalBytes?: number
  maxImageKb?: number
  isUploadBlocked?: boolean
  uploadBlockedReason?: 'UPLOAD_QUOTA_IMAGES_REACHED' | 'UPLOAD_QUOTA_BYTES_REACHED'
}
