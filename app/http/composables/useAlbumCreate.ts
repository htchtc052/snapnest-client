import type {Album} from "~/models/Album";
import type {AlbumCreateDto} from "~/contracts/album-manage.contract";

export async function useAlbumCreate(data: AlbumCreateDto): Promise<Album> {
    const client = useSanctumClient()
    return client<Album>(`/api/account/albums`, {
        method: 'POST',
        body: data,
    })
}
