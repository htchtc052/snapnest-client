export type User = {
  id: number
  name: string
  email: string
  avatar?: string | null
  avatarUrl?: string | null
  bio?: string | null
  birthDate?: string | null
  createdAt: string
  plan?: 'free' | 'premium'
  isAdmin?: boolean
  imagesUsed?: number
  bytesUsed?: number
  maxImages?: number
  maxTotalBytes?: number
  isUploadBlocked?: boolean
  uploadBlockedReason?: string
}
