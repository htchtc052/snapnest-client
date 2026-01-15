import type { SanctumClient } from "~/http/sanctum/sanctum-client.type";
import type { AlbumCreateDto } from "~/types/album-create.contracts";
import type { Album } from "~/types/album.model";

export async function albumCreate(client: SanctumClient, data: AlbumCreateDto): Promise<Album> {
    return client<Album>(`/api/account/albums`, {
        method: 'POST',
        body: data,
    })
}
