import type { Album } from '~/models/Album'
import type { Image } from '~/models/Image'
import type { PagingInfo } from '~/contracts/pagination-contract'
import { getPaging } from '~/http/get-paging'

interface AlbumWithImagesResponse {
    album: Album
    data: Image[]
    meta: PagingInfo
}

export async function useAlbumWithImages(id: Album['id']): Promise<{ album: Album; images: Image[]; paging: PagingInfo }> {
    const client = useSanctumClient()
    const res = await client<AlbumWithImagesResponse>(`/api/account/albums/${id}`)

    return {
        album: res.album,
        images: res.data,
        paging: getPaging(res.meta ?? null),
    }
}
