import type { AlbumPage } from '~/contracts/album.contract'
import type { Album } from '~/models/Album'

export function useAlbum(id: Album['id']) {
    const client = useSanctumClient()

    return (page: number): Promise<AlbumPage> =>
        client<AlbumPage>(`/api/account/albums/${id}`, {
            params: { page },
        })
}
