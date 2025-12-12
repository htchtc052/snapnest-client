import type { Album } from '~/models/Album'
import type { Image } from '~/models/Image'
import type { PagingInfo } from '~/contracts/pagination-contract'
import { getPaging } from '~/http/get-paging'

interface AlbumImagesPageResponse {
    data: Image[]
    meta: PagingInfo
}

export async function useAlbumImagesPage(albumId: Album['id'], page: number): Promise<{ images: Image[]; paging: PagingInfo }> {
    const client = useSanctumClient()
    const res = await client<AlbumImagesPageResponse>(`/api/account/albums/${albumId}/images?page=${page}`)

    return {
        images: res.data,
        paging: getPaging(res.meta ?? null),
    }
}
