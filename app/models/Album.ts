export type Album = {
    id: number
    name: string
    description: string | null
    imagesCount: number
    coverPreviewUrl?: string
    ownerId: number
    ownerName: string
    createdAt: string
}
