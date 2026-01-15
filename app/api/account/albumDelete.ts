import type { SanctumClient } from "~/http/sanctum/sanctum-client.type";
import type { Album } from "~/types/album.model";

export async function albumDelete(client: SanctumClient, id: Album['id']): Promise<void> {
    return client<void>(`/api/account/albums/${id}`, { method: 'DELETE' })
}
