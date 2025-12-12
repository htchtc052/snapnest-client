import type { Album } from '~/models/Album'
import type { Image } from '~/models/Image'
import type { PaginationPage } from '~/contracts/pagination-contract'

export type AlbumImagesPage = PaginationPage<Image> & { album: Album }

export function useAlbum(id: Album['id']) {
    const client = useSanctumClient()

    return (page: number): Promise<AlbumImagesPage> =>
        client<AlbumImagesPage>(`/api/account/albums/${id}`, {
            params: { page },
        })
}
