import type { SanctumClient } from "~/http/sanctum/sanctum-client.type";
import type { AlbumUpdateDto } from "~/types/album-info.contract";
import type { Album } from "~/types/album.model";

export async function albumUpdate(client: SanctumClient, id: Album['id'], data: AlbumUpdateDto): Promise<Album> {

    return client<Album>(`/api/account/albums/${id}`, {
        method: 'PUT',
        body: data,
    })
}
