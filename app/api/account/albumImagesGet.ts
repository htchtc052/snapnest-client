import type { SanctumClient } from '~/http/sanctum/sanctum-client.type'
import type { Image } from '~/types/image.model'

export type AlbumImagesPage = {
    entries: Image[]
    nextCursor: string | null
}

export function albumImagesGet(client: SanctumClient, albumId: number, cursor?: string): Promise<AlbumImagesPage> {
    const cursorParam = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
    return client<AlbumImagesPage>(`/api/account/albums/${albumId}/images${cursorParam}`)
}
