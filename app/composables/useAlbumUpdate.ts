import type {Album} from "~/models/Album";
import type {AlbumUpdateDto} from "~/contracts/album-manage.contract";

export async function useAlbumUpdate(id: Album['id'], data: AlbumUpdateDto): Promise<Album> {
    const client = useSanctumClient()
    return client<Album>(`/api/account/albums/${id}`, {
        method: 'PUT',
        body: data,
    })
}
