export type User = {
  id: number
  name: string
  email: string
  bio?: string | null
  birthDate?: string | null
  createdAt: string
  avatarUrl?: string | null
  plan?: 'free' | 'premium'
  isAdmin?: boolean
  imagesUsed?: number
  bytesUsed?: number
  maxImages?: number
  maxTotalBytes?: number
  isUploadBlocked?: boolean
  uploadBlockedReason?: string
}
