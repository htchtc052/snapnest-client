import type { PaginationPage } from "~/utils/types/pagination"
import type { Image } from "./Image"


export type Album = {
    id: number
    name: string
    imagesCount: number
    coverPreviewUrl?: string
    ownerId: number
    ownerName: string
    createdAt: string
}


export type AlbumPage = PaginationPage<Image> & { album: Album }
